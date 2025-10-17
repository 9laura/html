package primeiroProjeto;

import java.util.Scanner;

public class Lista {

	public static void main(String[] args) {
        Scanner sc = new Scanner(System.in);

        System.out.println("Escolha uma função para testar:");
        System.out.println("1 - Bom dia");
        System.out.println("2 - Retângulo");
        System.out.println("3 - Múltiplos de 5");
        System.out.println("4 - Contagem crescente");
        System.out.println("5 - Mostrar meses");

        int opcao = sc.nextInt();

        switch (opcao) {
            case 1 -> bomdia();
            case 2 -> desenharRetangulo();
            case 3 -> imprimirMultiplosDe5();
            case 4 -> contagemCrescente();
            case 5 -> mostrarMeses();
            default -> System.out.println("Opção inválida!");
          }
        }
    
    // 1 – Repetindo uma saudação
    static void bomdia() {
        for (int i = 0; i < 5; i++) {
            System.out.println("Bom dia!");
        }
    }

    // 2 – Desenhando um retângulo
    static void desenharRetangulo() {
        for (int i = 0; i < 3; i++) {
            System.out.println("*****");
        }
    }

    // 3 – Imprimindo múltiplos de 5
    static void imprimirMultiplosDe5() {
        for (int i = 5; i <= 25; i += 5) {
            System.out.println(i);
        }
    }

    // 4 – Exibindo uma contagem crescente
    static void contagemCrescente() {
        for (int i = 1; i <= 8; i++) {
            System.out.println(i);
        }
        System.out.println("Pronto!");
    }

    // 5 – Mostrando os meses do ano
    static void mostrarMeses() {
        String[] meses = {"janeiro", "fevereiro", "março", "abril", "maio", "junho"};
        for (String mes : meses) {
            System.out.println(mes);
        }
    }

    // ---------- FUNÇÕES COM PARÂMETRO ----------

    // 1 – Verificando divisibilidade
    static void verificarDivisivelPor5(int numero) {
        if (numero % 5 == 0) {
            System.out.println(numero + " é divisível por 5.");
        } else {
            System.out.println(numero + " não é divisível por 5.");
        }
    }

    // 2 – Mensagem de despedida
    static void mensagemDespedida(String nome) {
        System.out.println("Até logo, " + nome + "!");
    }

    // 3 – Unindo nomes
    static void unirNomes(String primeiroNome, String sobrenome) {
        System.out.println("Nome completo: " + primeiroNome + " " + sobrenome);
    }

    // 4 – Verificando maior que 100
    static void verificarMaiorQue100(int numero) {
        if (numero > 100) {
            System.out.println(numero + " é maior que 100.");
        } else {
            System.out.println(numero + " não é maior que 100.");
        }
    }

    // 5 – Classificando velocidade
    static void classificarVelocidade(int velocidade) {
        if (velocidade < 40) {
            System.out.println("Lenta");
        } else if (velocidade <= 80) {
            System.out.println("Normal");
        } else {
            System.out.println("Rápida");
        }
    }

    // 6 – Saudação por dia da semana
    static void saudacaoDia(String dia) {
        System.out.println("Tenha uma ótima " + dia + "!");
    }

    // 7 – Verificando situação de estoque
    static void verificarEstoque(int quantidade) {
        if (quantidade >= 10) {
            System.out.println("Estoque suficiente");
        } else if (quantidade >= 5) {
            System.out.println("Estoque baixo");
        } else {
            System.out.println("Estoque crítico");
        }
    }
}
