export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      leads: {
        Row: {
          id: string;
          user_id: string;
          nicho: string | null;
          nome: string;
          whatsapp: string | null;
          link_perfil: string | null;
          status_prospeccao: string;
          venda_realizada: string;
          observacoes: string | null;
          data_contato: string | null;
          msg_a_mandar: string | null;
          valor_venda: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          nicho?: string | null;
          nome: string;
          whatsapp?: string | null;
          link_perfil?: string | null;
          status_prospeccao?: string;
          venda_realizada?: string;
          observacoes?: string | null;
          data_contato?: string | null;
          msg_a_mandar?: string | null;
          valor_venda?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          nicho?: string | null;
          nome?: string;
          whatsapp?: string | null;
          link_perfil?: string | null;
          status_prospeccao?: string;
          venda_realizada?: string;
          observacoes?: string | null;
          data_contato?: string | null;
          msg_a_mandar?: string | null;
          valor_venda?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}