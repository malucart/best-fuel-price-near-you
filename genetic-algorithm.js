var coordenadas = { Px: null, Py: null };
var Populacao = [];
var DatabaseMatriz = [];

var X = 50;             //Numero de geracoes
var N = 100;            //Tamanho da populacao
var M = 1;              //Fator de mutacao
var E = 1;              //Indice de elitismo
var Ecologico = false;  //Bool dado pelo usuário. Se false, ele busca gasolina; caso contrário, álcool.
var NovaGeracao;
var Aptidao;
var MelhorAptidao = 0;
var IndiceMelhorAptidao;

$.getJSON("dados-gasolina.json", function(Database) 
{
  $.each(Database, function (key, val) 
  {
    DatabaseMatriz[key] = [val["Nº"], +val.Gasolina.replace(",", "."), +val["Álcool"].replace(",", "."), val.X, val.Y];
  });
});

function geneticAlgorithm(Px, Py)
{
  var i,j;

  Populacao = [];

  for (i = 0; i < N; i++) 
  {

    Populacao.push(Math.floor(Math.random() * 1000) + 1);

    for(j = 0; j < X; j++)
    {
   
      Aptidao = FuncaoAptidao(Populacao, DatabaseMatriz, Px, Py, Ecologico);
      NovaGeracao = Selecao(Populacao, Aptidao, DatabaseMatriz);
     
      for(k = 0; k < N; k++)
      {
        Populacao[k] = TesteMutacao(Populacao[k], M);
      }
      
      NovaGeracao = Elitismo(NovaGeracao, E, Aptidao, Populacao);
      Populacao = NovaGeracao;
    }

    for (j = 0; j < Aptidao.length; j++) 
    {
      if (MelhorAptidao < Aptidao[j]) 
      {
        MelhorAptidao = Aptidao[j];
        IndiceMelhorAptidao = j;
      }
    }
  }

  return DatabaseMatriz[Populacao[IndiceMelhorAptidao]-1];
}     

function FuncaoAptidao(Populacao, Database, Px, Py, Ecologico) 
{
  var i;
  var Aptidao = [];
  var Distancia;
  var PrecoGasolina;
  var PrecoAlcool;

  if (Ecologico == false) 
  {
    for (i = 0; i < Populacao.length; i++) 
    {
      Distancia = Math.sqrt(Math.pow((Px - DatabaseMatriz[Populacao[i] - 1][3]), 2) + Math.pow((Py - DatabaseMatriz[Populacao[i] - 1][4]), 2));
      PrecoGasolina = DatabaseMatriz[Populacao[i] - 1][1];
      
      if (Distancia == 0) 
      {
        Aptidao[i] = 100 + 454.54 - (90.9 * PrecoGasolina);
      } 
      else 
      {
        Aptidao[i] = 100 / Distancia + 454.54 - (90.9 * PrecoGasolina);
      }
    }
  } 
  else 
  {
    for (i = 0; i < Populacao.length; i++) 
    {
      Distancia = Math.sqrt(Math.pow((Px - DatabaseMatriz[Populacao[i] - 1][3]), 2) + Math.pow((Py - DatabaseMatriz[Populacao[i] - 1][4]), 2));
      PrecoAlcool = DatabaseMatriz[Populacao[i] - 1][2];

      if (Distancia == 0) 
      {
        Aptidao[i] = 100 + 400 - (100 * PrecoAlcool);
      } 
      else 
      {
        Aptidao[i] = 100 / Distancia + 400 - (100 * PrecoAlcool);
      }
    }
  }

  return Aptidao;
}

function Selecao(Populacao, Aptidao, Database)
{
  var i,j;
  var AptidaoAcumulada = 0;
  var AptidaoNormalizada = [];
  var k = 1;
  var Roleta;
  var Pai1, Pai2;
  var NovaGeracao =  [];
  var resposta = [];

  for(i = 0; i < Aptidao.length; i++)
  {
    AptidaoAcumulada = AptidaoAcumulada + Aptidao[i];
  }

  for(i = 0; i < Aptidao.length; i++)
  {
    AptidaoNormalizada[i] = Aptidao[i] / AptidaoAcumulada;
    AptidaoNormalizada[i] = AptidaoNormalizada[i] * k;
  }

  for(i = 0; i < (Populacao.length)/2; i++)
  {
     Roleta = Math.random();

    for(j = 0; j < AptidaoNormalizada.length; j++)
    {
      if(AptidaoNormalizada[j] > Roleta)
      {
        Pai1 = Populacao[j];
        break;
      } 
      else 
      {
        Roleta = Roleta - AptidaoNormalizada[j];
      }
    }
    
    Roleta = Math.random();

    for(j = 0; j < AptidaoNormalizada.length; j++)
    {
      if(AptidaoNormalizada[j] > Roleta)
      {
        Pai2 = Populacao[j];
        break;
      } 
      else 
      {
        Roleta = Roleta - AptidaoNormalizada[j];
      }
    }

    resposta = Reproducao(Pai1, Pai2);
    NovaGeracao[i] = resposta[0];
    NovaGeracao[Populacao.length-i-1] = resposta[1];
  }

  return NovaGeracao;
}

//recebe os dois pais para reprodução
function Reproducao (pai1, pai2)
{ 
  var filho1;
  var filho2;
  var resposta = [];

  filho1 = (pai1*2+pai2)/3; //media ponderada para reprodução
  filho2 = (pai2*2+pai1)/3;

  resposta[0]=Math.floor(filho1);   //alocando em um array os dois filhos
  resposta[1]=Math.floor(filho2);

  return resposta;
}

//função para testar se vai ser gerado mutação naquele filho
function TesteMutacao (filho, M)
{   
  var RandMutacao;

  //valor randomico de % de 0 a 100%
  RandMutacao = (Math.floor(Math.random() * 100));  
  
  //valor de mutação determinado na var global
  if (RandMutacao <= M)
  {   
    return Mutacao(filho);
  } 
  else 
  {
    return filho;
  }
}

function Mutacao (filho)
{
  var valorgerado;

  valorgerado = (Math.floor(Math.random() * 100));  //gera um numero entre 0 e 100 para fazer mutação

  //soma o valor de mutação ao filho, caso passe de 1000 pula
  if (filho+valorgerado<1000)
  { 
    return (filho+valorgerado);
  }
  //subtrai o valor de mutação ao filho, caso seja negativo pula
  else  
  { 
    return (filho-valorgerado);
  }
}

function Elitismo(NovaGeracao, E, Aptidao, Populacao) 
{
  var i,j;
  var MelhorAptidao = -1;
  var IndiceMelhorAptidao = -1;
  var Elites = [-1];
  var Excluido;
  var Presente = false;
   
  while (E > 0) 
  {
    Excluido = Math.floor(Math.random() * NovaGeracao.length);  //Numero aleatorio entre 0 e N

    for (i = 0; i < Aptidao.length; i++) 
    {
      if (MelhorAptidao < Aptidao[i]) 
      {
        for (j = 0; j < Elites.length; j++) 
        {
          if (i == Elites[j]) 
          {
             Presente = true;
          }
        }

        if (Presente == false) 
        {
          MelhorAptidao = Aptidao[i];
          IndiceMelhorAptidao = i;
        }
      }
    }
    Elites.push(IndiceMelhorAptidao);

    NovaGeracao[Excluido] = Populacao[IndiceMelhorAptidao];

    E = E - 1;
  }

  return NovaGeracao;
}