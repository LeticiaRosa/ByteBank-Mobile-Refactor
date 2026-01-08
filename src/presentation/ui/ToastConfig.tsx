/**
 * Presentation Layer - Toast Config
 * Configuração visual de toasts
 */

import { ToastConfig, BaseToast, ErrorToast } from "react-native-toast-message";
import {
  useToastStyleAdapter,
  useToastTextStyleAdapter,
} from "../../infrastructure/ui/useToastAdapters";

/**
 * Configuração customizada para os toasts
 * Deve ser usada no App.tsx ou componente raiz
 */
export const toastConfig: ToastConfig = {
  success: (props) => {
    const style = useToastStyleAdapter("success");
    const textStyles = useToastTextStyleAdapter();

    return (
      <BaseToast
        {...props}
        style={style}
        contentContainerStyle={textStyles.contentContainerStyle}
        text1Style={textStyles.text1Style}
        text2Style={textStyles.text2Style}
      />
    );
  },
  error: (props) => {
    const style = useToastStyleAdapter("error");
    const textStyles = useToastTextStyleAdapter();

    return (
      <ErrorToast
        {...props}
        style={style}
        contentContainerStyle={textStyles.contentContainerStyle}
        text1Style={textStyles.text1Style}
        text2Style={textStyles.text2Style}
      />
    );
  },
  info: (props) => {
    const style = useToastStyleAdapter("info");
    const textStyles = useToastTextStyleAdapter();

    return (
      <BaseToast
        {...props}
        style={style}
        contentContainerStyle={textStyles.contentContainerStyle}
        text1Style={textStyles.text1Style}
        text2Style={textStyles.text2Style}
      />
    );
  },
};
