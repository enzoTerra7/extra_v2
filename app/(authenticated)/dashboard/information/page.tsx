import { Bold, Text, Title } from "@tremor/react";

export default function Information() {
  return (
    <>
      {/* How Works */}
      <div className="p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="truncate">
            <Title className="text-center text-wrap lg:text-start text-4xl font-bold tracking-tight">
              Como funciona o cálculo?
            </Title>
          </div>
          <Text className="text-start">
            O cálculo das horas extras segue as normas apresentadas na{" "}
            <Bold>CLT</Bold> (Consolidação das Leis do Trabalho). Mais
            especificamente o 59. Segue abaixo uma ressalva dos trechos mais
            importantes para nós:
          </Text>
          <div className="flex flex-col gap-2.5 bg-neutral-300 dark:bg-neutral-700 p-4 rounded">
            <Text className="text-start">
              <Bold>Artigo 59</Bold>: Este artigo trata das exceções à duração
              normal do trabalho, permitindo a prorrogação da jornada em casos
              específicos, como necessidade imperiosa da empresa, para a
              realização de serviços inadiáveis ou cuja inexecução possa
              acarretar prejuízo manifesto.
            </Text>
            <Text className="text-start">
              <Bold>Artigo 59 § 1º</Bold>: Este parágrafo estabelece que a
              remuneração das horas extras será, pelo menos, 50% superior à da
              hora normal, mas ressalta que as horas extras habitualmente
              prestadas podem ser incluídas no salário do empregado.
            </Text>
            <Text className="text-start">
              <Bold>Artigo 59 § 2º</Bold>: Este parágrafo determina que, nos
              casos em que não houver compensação das horas extras, o empregado
              terá direito ao pagamento das mesmas com o acréscimo mínimo de 50%
              sobre o valor da hora normal.
            </Text>
          </div>
          <Text className="text-start">
            Como a base da lei determina que seja de pelo menos 50%, usamos esse
            valor como cálculo para determinar o valor da hora extra. Segue
            abaixo como é feito o calculo (vale ressaltar que o cálculo é feito
            apenas com base nas horas extras, desconsiderando os adicionais de
            trabalho noturno ou de trabalho em domingos e feriados):
          </Text>
          <div className="flex flex-col bg-neutral-300 dark:bg-neutral-700  p-4 rounded">
            <p className="text-center">
              <Bold>
                Valor da sua hora = (Salário / 4.33) / (dias trabalhados * horas
                trabalhadas)
              </Bold>
            </p>
            <small className="text-center">
              4.33% é o números de semanas trabalhadas no mês. Esse valor foi
              retirado de consultas através da internet, mas em alguns lugares
              também se é calculado utilizando 5 semanas
            </small>
          </div>
          <div className="flex items-center justify-center text-center bg-neutral-300 dark:bg-neutral-700 p-4 rounded">
            <p>
              <Bold>Valor da hora extra = (Valor da sua hora) x 150%</Bold>
            </p>
          </div>
        </div>
      </div>

      {/* What's next */}
      <div className="p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="truncate">
            <Title className="text-center text-wrap lg:text-start text-4xl font-bold tracking-tight">
              O que vai vim de novo?
            </Title>
          </div>
          <Text className="text-start">
            A nossa plataforma continua em constante evolução e já se é
            preparado algumas novidades para o futuro. Sendo as principais:
          </Text>
          <ul>
            <li>
              <Bold>Dashboard</Bold> - Será adicionado uma tela de dashboard
              aonde será possível visualizar quantas horas você fez por dia
              durante seu mês, além de todo o valor que deverá receber naquele
              mês de extras, o total das suas horas já feitas no mês e o total
              de horas desde que entrou na plataforma!
            </li>
            <li>
              <Bold>Recuperação de Senha</Bold> - Como o povo tem memória fraca
              e pode acabar esquecendo a senha, será implementado uma tela de
              recuperação de senha para que você possa redefinir a sua caso
              perca.
            </li>
          </ul>
        </div>
      </div>

      {/* Possible changes to future */}
      <div className="p-6 flex gap-4 flex-col rounded-xl bg-neutral-100 dark:bg-neutral-900">
        <div className="flex flex-col gap-4">
          <div className="truncate">
            <Title className="text-center text-wrap lg:text-start text-4xl font-bold tracking-tight">
              E possíveis alterações?
            </Title>
          </div>
          <Text className="text-start">
            Para tentar completar ainda mais a plataforma{" "}
            <Bold>
              <span className="text-sky-600">EX</span>TRAS
            </Bold>
            , poderão ser adicionadas (mas nada garantido) funcionalidades como:
          </Text>
          <ul>
            <li>
              <Bold>Cálculos noturnos e de feriados</Bold> - A lei prevê uma
              adicional de 20% para as horas feitas em períodos noturnos, e de
              100% para aquelas feitas em feriados ou domingos
            </li>
            <li>
              <Bold>Login social</Bold> - Visando facilitar o acesso à
              plataforma, pode ser inserido login sociais como: Google,
              Facebook, etc.
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
