import { BehaviorSubject, Observable, Subject } from "rxjs";
import { distinctUntilChanged, shareReplay, filter, map } from "rxjs/operators";
import { supabase } from "../../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Transaction } from "../../lib/transactions";

/**
 * Interface para atualizações de transações
 */
export interface TransactionUpdate {
  transaction: Transaction;
  timestamp: Date;
  source: "realtime" | "initial" | "refresh";
  eventType: "INSERT" | "UPDATE" | "DELETE";
}

/**
 * Estado da conexão do serviço
 */
export interface ConnectionState {
  isConnected: boolean;
  accountId: string | null;
  lastUpdate: Date | null;
  error: Error | null;
}

/**
 * Serviço de gerenciamento de transações em tempo real usando RxJS e Supabase Realtime
 *
 * Funcionalidades:
 * - Sincronização real-time das transações via Supabase Realtime
 * - Distinct para evitar atualizações duplicadas
 * - Conversão automática de tipos
 * - Logging detalhado para debug
 */
class TransactionsService {
  // Subject principal que mantém a lista de transações
  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  // Subject para atualizações individuais (com metadados)
  private transactionUpdateSubject = new Subject<TransactionUpdate>();

  // Subject para o estado da conexão
  private connectionStateSubject = new BehaviorSubject<ConnectionState>({
    isConnected: false,
    accountId: null,
    lastUpdate: null,
    error: null,
  });

  // Canal Realtime do Supabase
  private channel: RealtimeChannel | null = null;

  // ID da conta atualmente monitorada
  private currentAccountId: string | null = null;

  /**
   * Observable da lista de transações
   * - Distinct: Só emite quando a lista muda
   * - Replay: Novos subscribers recebem a última lista
   */
  public transactions$: Observable<Transaction[]> = this.transactionsSubject
    .asObservable()
    .pipe(distinctUntilChanged(), shareReplay(1));

  /**
   * Observable de atualizações individuais de transações (com metadados)
   */
  public transactionUpdates$: Observable<TransactionUpdate> =
    this.transactionUpdateSubject.asObservable().pipe(shareReplay(1));

  /**
   * Observable do estado da conexão
   */
  public connectionState$: Observable<ConnectionState> =
    this.connectionStateSubject.asObservable().pipe(shareReplay(1));

  /**
   * Inicia o monitoramento real-time das transações
   *
   * @param userId - ID do usuário logado
   * @returns Promise<void>
   */
  async startTransactionsStream(userId: string): Promise<void> {
    console.log("🚀 [TransactionsService] Iniciando stream de transações", {
      userId,
    });

    // Se já está monitorando o mesmo usuário, não faz nada
    if (this.currentAccountId === userId && this.channel) {
      console.log("⚠️ [TransactionsService] Stream já ativo para este usuário");
      return;
    }

    // Se está monitorando outro usuário, para o stream anterior
    if (this.channel) {
      console.log(
        "🔄 [TransactionsService] Parando stream anterior antes de iniciar novo"
      );
      await this.stopTransactionsStream();
    }

    this.currentAccountId = userId;

    try {
      // 1. Buscar transações iniciais
      await this.fetchInitialTransactions(userId);

      // 2. Configurar Supabase Realtime
      this.setupRealtimeChannel(userId);

      // Atualizar estado da conexão
      this.updateConnectionState({
        isConnected: true,
        accountId: userId,
        lastUpdate: new Date(),
        error: null,
      });
    } catch (error) {
      console.error("❌ [TransactionsService] Erro ao iniciar stream:", error);
      this.updateConnectionState({
        isConnected: false,
        accountId: userId,
        lastUpdate: null,
        error: error as Error,
      });
      throw error;
    }
  }

  /**
   * Busca as transações iniciais do usuário
   */
  private async fetchInitialTransactions(userId: string): Promise<void> {
    console.log("⏳ [TransactionsService] Buscando transações iniciais...");

    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "❌ [TransactionsService] Erro ao buscar transações iniciais:",
        error
      );
      throw error;
    }

    if (data) {
      console.log(
        "✅ [TransactionsService] Transações iniciais carregadas:",
        data.length
      );

      // Emitir transações iniciais
      this.transactionsSubject.next(data as Transaction[]);

      // Emitir update para cada transação
      data.forEach((transaction) => {
        this.transactionUpdateSubject.next({
          transaction: transaction as Transaction,
          timestamp: new Date(),
          source: "initial",
          eventType: "INSERT",
        });
      });
    }
  }

  /**
   * Configura o canal Realtime do Supabase
   */
  private setupRealtimeChannel(userId: string): void {
    console.log("🔌 [TransactionsService] Configurando canal Realtime...");

    this.channel = supabase
      .channel(`transactions:${userId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "transactions",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log(
            "📡 [TransactionsService] ================================"
          );
          console.log("📡 [TransactionsService] EVENTO REALTIME RECEBIDO!");
          console.log(
            "📡 [TransactionsService] Event Type:",
            payload.eventType
          );
          console.log("📡 [TransactionsService] Table:", payload.table);
          console.log("📡 [TransactionsService] New data:", payload.new);
          console.log(
            "📡 [TransactionsService] ================================"
          );

          this.handleRealtimeUpdate(payload);
        }
      )
      .subscribe((status, err) => {
        console.log("📊 [TransactionsService] Status do canal:", status);

        if (err) {
          console.error("❌ [TransactionsService] Erro na subscrição:", err);
        }

        if (status === "SUBSCRIBED") {
          console.log(
            "✅ [TransactionsService] Canal Realtime inscrito com sucesso"
          );
          console.log(
            "🎯 [TransactionsService] Monitorando tabela: transactions"
          );
          console.log("🎯 [TransactionsService] Filtro: user_id=eq." + userId);
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ [TransactionsService] Erro no canal Realtime");
          this.updateConnectionState({
            isConnected: false,
            accountId: this.currentAccountId,
            lastUpdate: new Date(),
            error: new Error("Canal Realtime com erro"),
          });
        }
      });
  }

  /**
   * Processa atualizações do Realtime
   */
  private handleRealtimeUpdate(payload: any): void {
    try {
      const eventType = payload.eventType as "INSERT" | "UPDATE" | "DELETE";
      const currentTransactions = this.transactionsSubject.value;

      if (eventType === "INSERT") {
        const newTransaction = payload.new as Transaction;
        console.log("➕ [TransactionsService] Nova transação:", newTransaction);

        // Adiciona no início da lista
        const updatedTransactions = [newTransaction, ...currentTransactions];
        this.transactionsSubject.next(updatedTransactions);

        this.transactionUpdateSubject.next({
          transaction: newTransaction,
          timestamp: new Date(),
          source: "realtime",
          eventType: "INSERT",
        });
      } else if (eventType === "UPDATE") {
        const updatedTransaction = payload.new as Transaction;
        console.log(
          "✏️ [TransactionsService] Transação atualizada:",
          updatedTransaction
        );

        // Atualiza a transação na lista
        const updatedTransactions = currentTransactions.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        );
        this.transactionsSubject.next(updatedTransactions);

        this.transactionUpdateSubject.next({
          transaction: updatedTransaction,
          timestamp: new Date(),
          source: "realtime",
          eventType: "UPDATE",
        });
      } else if (eventType === "DELETE") {
        const deletedId = payload.old.id;
        console.log("🗑️ [TransactionsService] Transação deletada:", deletedId);

        // Remove da lista
        const updatedTransactions = currentTransactions.filter(
          (t) => t.id !== deletedId
        );
        this.transactionsSubject.next(updatedTransactions);

        this.transactionUpdateSubject.next({
          transaction: payload.old as Transaction,
          timestamp: new Date(),
          source: "realtime",
          eventType: "DELETE",
        });
      }

      // Atualizar estado da conexão
      this.updateConnectionState({
        isConnected: true,
        accountId: this.currentAccountId,
        lastUpdate: new Date(),
        error: null,
      });
    } catch (error) {
      console.error(
        "❌ [TransactionsService] Erro ao processar atualização Realtime:",
        error
      );
    }
  }

  /**
   * Para o monitoramento de transações
   */
  async stopTransactionsStream(): Promise<void> {
    console.log("🛑 [TransactionsService] Parando stream de transações...");

    if (this.channel) {
      await supabase.removeChannel(this.channel);
      this.channel = null;
    }

    this.currentAccountId = null;

    this.updateConnectionState({
      isConnected: false,
      accountId: null,
      lastUpdate: new Date(),
      error: null,
    });

    console.log("✅ [TransactionsService] Stream parado com sucesso");
  }

  /**
   * Atualiza as transações manualmente (útil para refresh)
   */
  async refreshTransactions(userId: string): Promise<void> {
    console.log(
      "🔄 [TransactionsService] Fazendo refresh manual das transações..."
    );

    try {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        this.transactionsSubject.next(data as Transaction[]);
        console.log(
          "✅ [TransactionsService] Transações atualizadas manualmente:",
          data.length
        );
      }
    } catch (error) {
      console.error(
        "❌ [TransactionsService] Erro ao atualizar transações:",
        error
      );
      throw error;
    }
  }

  /**
   * Observable para transações filtradas por tipo
   */
  getTransactionsByType$(
    type: Transaction["transaction_type"]
  ): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((transactions) =>
        transactions.filter((t) => t.transaction_type === type)
      )
    );
  }

  /**
   * Observable para transações filtradas por status
   */
  getTransactionsByStatus$(
    status: Transaction["status"]
  ): Observable<Transaction[]> {
    return this.transactions$.pipe(
      map((transactions) => transactions.filter((t) => t.status === status))
    );
  }

  /**
   * Observable para atualizações filtradas por evento
   */
  getUpdatesByEventType$(
    eventType: "INSERT" | "UPDATE" | "DELETE"
  ): Observable<TransactionUpdate> {
    return this.transactionUpdates$.pipe(
      filter((update) => update.eventType === eventType)
    );
  }

  /**
   * Obtém a lista atual de transações (síncrono)
   */
  getCurrentTransactions(): Transaction[] {
    return this.transactionsSubject.value;
  }

  /**
   * Obtém o estado atual da conexão (síncrono)
   */
  getConnectionState(): ConnectionState {
    return this.connectionStateSubject.value;
  }

  /**
   * Atualiza o estado da conexão
   */
  private updateConnectionState(state: ConnectionState): void {
    this.connectionStateSubject.next(state);
  }

  /**
   * Limpa todos os recursos
   */
  async destroy(): Promise<void> {
    console.log("🧹 [TransactionsService] Destruindo serviço...");

    await this.stopTransactionsStream();

    this.transactionsSubject.complete();
    this.transactionUpdateSubject.complete();
    this.connectionStateSubject.complete();

    console.log("✅ [TransactionsService] Serviço destruído");
  }
}

// Singleton do serviço
export const transactionsService = new TransactionsService();
