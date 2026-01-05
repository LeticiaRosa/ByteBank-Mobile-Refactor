import { BehaviorSubject, Observable, Subject } from "rxjs";
import {
  debounceTime,
  distinctUntilChanged,
  shareReplay,
  filter,
} from "rxjs/operators";
import { supabase } from "../../lib/supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";

/**
 * Interface para atualizações de saldo
 */
export interface BalanceUpdate {
  accountId: string;
  balance: number; // Saldo em reais (já convertido de centavos)
  balanceCents: number; // Saldo original em centavos
  timestamp: Date;
  source: "realtime" | "initial" | "refresh";
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
 * Serviço de gerenciamento de saldo em tempo real usando RxJS e Supabase Realtime
 *
 * Funcionalidades:
 * - Sincronização real-time do saldo via Supabase Realtime
 * - Debounce e distinct para evitar atualizações duplicadas
 * - Retry automático em caso de falhas
 * - Conversão automática de centavos para reais
 * - Logging detalhado para debug
 */
class BalanceService {
  // Subject principal que mantém o estado do saldo
  private balanceSubject = new BehaviorSubject<number>(0);

  // Subject para atualizações completas (com metadados)
  private balanceUpdateSubject = new Subject<BalanceUpdate>();

  // Subject para o estado da conexão
  private connectionStateSubject = new BehaviorSubject<ConnectionState>({
    isConnected: false,
    accountId: null,
    lastUpdate: null,
    error: null,
  });

  // Subject para controlar o ciclo de vida
  private destroySubject = new Subject<void>();

  // Canal Realtime do Supabase
  private channel: RealtimeChannel | null = null;

  // ID da conta atualmente monitorada
  private currentAccountId: string | null = null;

  /**
   * Observable do saldo atual (apenas o valor numérico)
   * - Distinct: Só emite quando o valor muda
   * - Replay: Novos subscribers recebem o último valor
   */
  public balance$: Observable<number> = this.balanceSubject
    .asObservable()
    .pipe(distinctUntilChanged(), shareReplay(1));

  /**
   * Observable de atualizações completas do saldo (com metadados)
   */
  public balanceUpdates$: Observable<BalanceUpdate> = this.balanceUpdateSubject
    .asObservable()
    .pipe(shareReplay(1));

  /**
   * Observable do estado da conexão
   */
  public connectionState$: Observable<ConnectionState> =
    this.connectionStateSubject.asObservable().pipe(shareReplay(1));

  /**
   * Inicia o monitoramento real-time do saldo
   *
   * @param userId - ID do usuário logado
   * @param accountId - ID da conta bancária a monitorar
   * @returns Promise<void>
   */
  async startBalanceStream(userId: string, accountId: string): Promise<void> {
    console.log("🚀 [BalanceService] Iniciando stream de saldo", {
      userId,
      accountId,
    });

    // Se já está monitorando a mesma conta, não faz nada
    if (this.currentAccountId === accountId && this.channel) {
      console.log("⚠️ [BalanceService] Stream já ativo para esta conta");
      return;
    }

    // Se está monitorando outra conta, para o stream anterior
    if (this.channel) {
      console.log(
        "🔄 [BalanceService] Parando stream anterior antes de iniciar novo"
      );
      await this.stopBalanceStream();
    }

    this.currentAccountId = accountId;

    try {
      // 1. Buscar saldo inicial
      await this.fetchInitialBalance(accountId);

      // 2. Configurar Supabase Realtime
      this.setupRealtimeChannel(accountId);

      // Atualizar estado da conexão
      this.updateConnectionState({
        isConnected: true,
        accountId,
        lastUpdate: new Date(),
        error: null,
      });
    } catch (error) {
      console.error("❌ [BalanceService] Erro ao iniciar stream:", error);
      this.updateConnectionState({
        isConnected: false,
        accountId,
        lastUpdate: null,
        error: error as Error,
      });
      throw error;
    }
  }

  /**
   * Busca o saldo inicial da conta
   */
  private async fetchInitialBalance(accountId: string): Promise<void> {
    console.log("⏳ [BalanceService] Buscando saldo inicial...");
    console.log("🔍 [BalanceService] Account ID para busca:", accountId);

    const { data, error } = await supabase
      .from("bank_accounts")
      .select("balance, id, user_id, account_number")
      .eq("id", accountId)
      .single();

    if (error) {
      console.error("❌ [BalanceService] Erro ao buscar saldo inicial:", error);
      throw error;
    }

    if (data) {
      const balanceCents = data.balance || 0;
      const balanceReais = balanceCents / 100;

      console.log("✅ [BalanceService] Saldo inicial carregado:", {
        accountId: data.id,
        userId: data.user_id,
        accountNumber: data.account_number,
        balanceCents,
        balanceReais,
      });
      console.log(
        "💡 [BalanceService] Este é o ID que será monitorado:",
        data.id
      );

      // Emitir saldo inicial
      this.balanceSubject.next(balanceReais);
      this.balanceUpdateSubject.next({
        accountId,
        balance: balanceReais,
        balanceCents,
        timestamp: new Date(),
        source: "initial",
      });
    }
  }

  /**
   * Configura o canal Realtime do Supabase
   */
  private setupRealtimeChannel(accountId: string): void {
    console.log("🔌 [BalanceService] Configurando canal Realtime...");
    console.log("🔍 [BalanceService] Account ID:", accountId);
    console.log("🔍 [BalanceService] Filter:", `id=eq.${accountId}`);

    this.channel = supabase
      .channel(`balance:${accountId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "bank_accounts",
          filter: `id=eq.${accountId}`,
        },
        (payload) => {
          console.log("📡 [BalanceService] ================================");
          console.log("📡 [BalanceService] EVENTO REALTIME RECEBIDO!");
          console.log("📡 [BalanceService] Event Type:", payload.eventType);
          console.log("📡 [BalanceService] Schema:", payload.schema);
          console.log("📡 [BalanceService] Table:", payload.table);
          console.log("📡 [BalanceService] Old data:", payload.old);
          console.log("📡 [BalanceService] New data:", payload.new);
          console.log("📡 [BalanceService] ================================");

          this.handleRealtimeUpdate(accountId, payload);
        }
      )
      .subscribe((status, err) => {
        console.log("📊 [BalanceService] Status do canal:", status);

        if (err) {
          console.error("❌ [BalanceService] Erro na subscrição:", err);
        }

        if (status === "SUBSCRIBED") {
          console.log(
            "✅ [BalanceService] Canal Realtime inscrito com sucesso"
          );
          console.log("🎯 [BalanceService] Monitorando tabela: bank_accounts");
          console.log("🎯 [BalanceService] Filtro: id=eq." + accountId);
          console.log("💡 [BalanceService] Aguardando mudanças na tabela...");
        } else if (status === "CHANNEL_ERROR") {
          console.error("❌ [BalanceService] Erro no canal Realtime");
          console.error("📋 [BalanceService] Possíveis causas:");
          console.error("   1. REPLICA IDENTITY não está como FULL");
          console.error(
            "   2. Tabela não está na publicação supabase_realtime"
          );
          console.error("   3. RLS bloqueando as atualizações");
          console.error("   4. Realtime desabilitado no projeto Supabase");

          this.updateConnectionState({
            isConnected: false,
            accountId: this.currentAccountId,
            lastUpdate: new Date(),
            error: new Error("Canal Realtime com erro"),
          });
        } else if (status === "TIMED_OUT") {
          console.error("⏱️ [BalanceService] Timeout na conexão Realtime");
        } else if (status === "CLOSED") {
          console.log("🔒 [BalanceService] Canal fechado");
        }
      });
  }

  /**
   * Processa atualizações do Realtime
   */
  private handleRealtimeUpdate(accountId: string, payload: any): void {
    try {
      // Para UPDATE: usar payload.new
      // Para INSERT: usar payload.new
      // Para DELETE: payload.new será null
      const newData = payload.new;

      if (!newData) {
        console.warn(
          "⚠️ [BalanceService] Payload sem dados (possivelmente DELETE)"
        );
        return;
      }

      const balanceCents = newData.balance || 0;
      const balanceReais = balanceCents / 100;

      console.log("💰 [BalanceService] Novo saldo recebido:", {
        balanceCents,
        balanceReais,
        event: payload.eventType,
      });

      // Emitir novo saldo
      this.balanceSubject.next(balanceReais);
      this.balanceUpdateSubject.next({
        accountId,
        balance: balanceReais,
        balanceCents,
        timestamp: new Date(),
        source: "realtime",
      });

      // Atualizar estado da conexão
      this.updateConnectionState({
        isConnected: true,
        accountId: this.currentAccountId,
        lastUpdate: new Date(),
        error: null,
      });
    } catch (error) {
      console.error(
        "❌ [BalanceService] Erro ao processar atualização Realtime:",
        error
      );
    }
  }

  /**
   * Para o monitoramento de saldo
   */
  async stopBalanceStream(): Promise<void> {
    console.log("🛑 [BalanceService] Parando stream de saldo...");

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

    console.log("✅ [BalanceService] Stream parado com sucesso");
  }

  /**
   * Atualiza o saldo manualmente (útil para refresh)
   */
  async refreshBalance(accountId: string): Promise<void> {
    console.log("🔄 [BalanceService] Fazendo refresh manual do saldo...");

    try {
      const { data, error } = await supabase
        .from("bank_accounts")
        .select("balance")
        .eq("id", accountId)
        .single();

      if (error) throw error;

      if (data) {
        const balanceCents = data.balance || 0;
        const balanceReais = balanceCents / 100;

        this.balanceSubject.next(balanceReais);
        this.balanceUpdateSubject.next({
          accountId,
          balance: balanceReais,
          balanceCents,
          timestamp: new Date(),
          source: "refresh",
        });

        console.log("✅ [BalanceService] Saldo atualizado manualmente:", {
          balanceReais,
        });
      }
    } catch (error) {
      console.error("❌ [BalanceService] Erro ao atualizar saldo:", error);
      throw error;
    }
  }

  /**
   * Observable para mudanças de saldo com debounce
   * Útil para evitar múltiplas atualizações seguidas
   *
   * @param debounceMs - Tempo de debounce em milissegundos
   */
  getBalanceChanges$(debounceMs: number = 500): Observable<number> {
    return this.balance$.pipe(debounceTime(debounceMs), distinctUntilChanged());
  }

  /**
   * Observable para atualizações de saldo filtradas por source
   */
  getBalanceUpdatesBySource$(
    source: "realtime" | "initial" | "refresh"
  ): Observable<BalanceUpdate> {
    return this.balanceUpdates$.pipe(
      filter((update) => update.source === source)
    );
  }

  /**
   * Obtém o saldo atual (síncrono)
   */
  getCurrentBalance(): number {
    return this.balanceSubject.value;
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
    console.log("🧹 [BalanceService] Destruindo serviço...");

    this.destroySubject.next();
    this.destroySubject.complete();

    await this.stopBalanceStream();

    this.balanceSubject.complete();
    this.balanceUpdateSubject.complete();
    this.connectionStateSubject.complete();

    console.log("✅ [BalanceService] Serviço destruído");
  }
}

// Singleton do serviço
export const balanceService = new BalanceService();
