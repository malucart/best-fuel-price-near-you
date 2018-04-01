// const Database = require('./dados-gasolina.json');

// var math = require('mathjs');
var coordenadas = { Px: null, Py: null };
var Populacao = [];
var DatabaseMatriz = [];

var X = 50;  //Numero de geracoes
var N = 100;  //Tamanho da populacao
var M = 1;  //Fator de mutacao
var E = 1;  //Indice de elitismo
var Ecologico = false;  //Bool dado pelo usuário. Se false, ele busca gasolina; caso contrário, álcool.
var NovaGeracao;
var Aptidao;
var i,j;
var MelhorAptidao = 0;
var IndiceMelhorAptidao;

$.getJSON("dados-gasolina.json", function(Database) 
{
  $.each(Database, function (key, val) 
  {
    DatabaseMatriz[key] = [val["Nº"], +val.Gasolina.replace(",", "."), +val["Álcool"].replace(",", "."), val.X, val.Y];
  });
});

// Database.forEach(posto => {
// DatabaseMatriz[posto["Nº"] - 1] = [posto["Nº"], +posto.Gasolina.replace(",", "."), +posto['Álcool'].replace(",", "."), posto.X, posto.Y];
// });

// console.log('Digite sua coordenada X:');
// process.stdin.on('data', coord => {  //"process" é do nodejs para fazer um bom processo de dados, "on" dá mais consistência no que está acontecendo, "coord" é variavél que escolhi o nome
//     if (!coordenadas.Py && coordenadas.Px) // se não tem Y ainda & tem X
//          coordenadas.Py = +coord.toString().replace('\r\n', ''); //esse método ele gera em bits, entao transforma pra string pra dps pegar um valor da string
//      if (!coordenadas.Px) {  //Se não tem X ainda (ele começa o código nesse segundo if pq se ele ficar em cima do primeiro, Y fica com valor de X, ele ignora o lance de colocar o valor de Y)
//          coordenadas.Px = +coord.toString().replace('\r\n', '');
//          console.log('Digite sua coordenada Y:');
//         }
//      if (coordenadas.Px && coordenadas.Py) {
//          console.log(coordenadas);
//          for (i = 0; i < N; i++) {
//          Populacao.push(Math.floor(Math.random() * 1000) + 1);
//          for(i = 0; i < X; i++){
//             //console.log(Populacao);
//             Aptidao = FuncaoAptidao(Populacao, DatabaseMatriz, coordenadas.Px, coordenadas.Py, Ecologico);
//             //console.log(Aptidao);
//             NovaGeracao = Selecao(Populacao, Aptidao, DatabaseMatriz);
//             //console.log(NovaGeracao);
//             for(j = 0; j < N; j++){
//                 Populacao[j] = TesteMutacao(Populacao[j], M);
//             }
//             NovaGeracao = Elitismo(NovaGeracao, E, Aptidao, Populacao);
//             Populacao = NovaGeracao;
//         }
        
//         for (i = 0; i < Aptidao.length; i++) {
//             if (MelhorAptidao < Aptidao[i]) {
//                 MelhorAptidao = Aptidao[i];
//                 IndiceMelhorAptidao = i;
//             }
//         }
      
//         }
//         console.log(DatabaseMatriz[Populacao[IndiceMelhorAptidao]-1]);
//      };
//     });

function geneticAlgorithm(Px, Py)
{
  for (i = 0; i < N; i++) 
  {
    Populacao.push(Math.floor(Math.random() * 1000) + 1);

    for(i = 0; i < X; i++)
    {
      Aptidao = FuncaoAptidao(Populacao, DatabaseMatriz, Px, Py, Ecologico);
      NovaGeracao = Selecao(Populacao, Aptidao, DatabaseMatriz);
     
      for(j = 0; j < N; j++)
      {
        Populacao[j] = TesteMutacao(Populacao[j], M);
      }
      
      NovaGeracao = Elitismo(NovaGeracao, E, Aptidao, Populacao);
      Populacao = NovaGeracao;
    }

    for (i = 0; i < Aptidao.length; i++) 
    {
      if (MelhorAptidao < Aptidao[i]) 
      {
        MelhorAptidao = Aptidao[i];
        IndiceMelhorAptidao = i;
      }
    }
  }

  return DatabaseMatriz[Populacao[IndiceMelhorAptidao]-1];
}     

function FuncaoAptidao(Populacao, Database, Px, Py, Ecologico) {
    var Aptidao = [];
    var i;
    var Distancia;
    var PrecoGasolina;
    var PrecoAlcool;

    if (Ecologico == false) {
        //console.log(DatabaseMatriz[3][3]);
        //console.log(Populacao);
          for (i = 0; i < Populacao.length; i++) {
            //console.log(i);
            //console.log(Populacao[i]);
            Distancia = Math.sqrt(Math.pow((Px - DatabaseMatriz[Populacao[i] - 1][3]), 2) + Math.pow((Py - DatabaseMatriz[Populacao[i] - 1][4]), 2));
            PrecoGasolina = DatabaseMatriz[Populacao[i] - 1][1];
                if (Distancia == 0) {
                    Aptidao[i] = 100 + 454.54 - (90.9 * PrecoGasolina);
                    } else {
                    Aptidao[i] = 100 / Distancia + 454.54 - (90.9 * PrecoGasolina);
                   }
                   //console.log(Aptidao[i]);
           }
           //console.log(Aptidao);
   } else {
            for (i = 0; i < Populacao.length; i++) {
            Distancia = Math.sqrt(Math.pow((Px - DatabaseMatriz[Populacao[i] - 1][3]), 2) + Math.pow((Py - DatabaseMatriz[Populacao[i] - 1][4]), 2));
            //console.log(Distancia);
            PrecoAlcool = DatabaseMatriz[Populacao[i] - 1][2];
                if (Distancia == 0) {
                Aptidao[i] = 100 + 400 - (100 * PrecoAlcool);
            } else {
                     Aptidao[i] = 100 / Distancia + 400 - (100 * PrecoAlcool);
                    }
            }
        }
   return Aptidao;
}

function Selecao(Populacao, Aptidao, Database){
   var i;
   var AptidaoAcumulada = 0;
   var AptidaoNormalizada = [];
   var k = 1;
   var j;
   var Roleta;
   var Pai1, Pai2;
   var NovaGeracao =  [];
   var resposta = [];

   //console.log(Populacao);
   for(j = 0; j < Aptidao.length; j++){
       AptidaoAcumulada = AptidaoAcumulada + Aptidao[j];
       //console.log(AptidaoAcumulada);
   }
   for(j = 0; j < Aptidao.length; j++){
       AptidaoNormalizada[j] = Aptidao[j] / AptidaoAcumulada;
       AptidaoNormalizada[j] = AptidaoNormalizada[j] * k;
   }
   for(i = 0; i < (Populacao.length)/2; i++){
       Roleta = Math.random();
       //console.log(Roleta);
       for(j = 0; j < AptidaoNormalizada.length; j++){
        //console.log(AptidaoNormalizada[j]);
         if(AptidaoNormalizada[j] > Roleta){
            Pai1 = Populacao[j];
            //console.log(Pai1);
            break;
         } else {
             Roleta = Roleta - AptidaoNormalizada[j];
             //console.log(Roleta);
         }
       }
       Roleta = Math.random();
       for(j = 0; j < AptidaoNormalizada.length; j++){
         if(AptidaoNormalizada[j] > Roleta){
            Pai2 = Populacao[j];
            break;
         } else {
             Roleta = Roleta - AptidaoNormalizada[j];
         }
       }
       //console.log(Pai1);
       //console.log(Pai2);
       resposta = Reproducao(Pai1, Pai2);
       NovaGeracao[i] = resposta[0];
       NovaGeracao[Populacao.length-i-1] = resposta[1];
   }
   return NovaGeracao;
}

function Reproducao (pai1, pai2){	//recebe os dois pais para reprodução
   var filho1;
   var filho2;
   var resposta = [];

   filho1 = (pai1*2+pai2)/3;	//media ponderada para reprodução
   filho2 = (pai2*2+pai1)/3;

   resposta[0]=Math.floor(filho1);		//alocando em um array os dois filhos
   resposta[1]=Math.floor(filho2);

   return resposta;
}

function TesteMutacao (filho, M){		//função para testar se vai ser gerado mutação naquele filho
   var RandMutacao;

   RandMutacao = (Math.floor(Math.random() * 100));	//valor randomico de % de 0 a 100%
   if (RandMutacao <= M){		//valor de mutação determinado na var global
       return Mutacao(filho);
   } else {
       return filho;
   }
}

function Mutacao (filho){
   var valorgerado;

   valorgerado = (Math.floor(Math.random() * 100));	//gera um numero entre 0 e 100 para fazer mutação

   if (filho+valorgerado<1000){	//soma o valor de mutação ao filho, caso passe de 1000 pula
       return (filho+valorgerado);
   }
   else {	//subtrai o valor de mutação ao filho, caso seja negativo pula
       return (filho-valorgerado);
   }
}

function Elitismo(NovaGeracao, E, Aptidao, Populacao) {
   var i;
   var j;
   var MelhorAptidao = -1;
   var IndiceMelhorAptidao = -1;
   var Elites = [-1];
   var Excluido;
   var Presente = false;
   
   while (E > 0) {
       Excluido = Math.floor(Math.random() * NovaGeracao.length);	//Numero aleatorio entre 0 e N

       for (i = 0; i < Aptidao.length; i++) {
           if (MelhorAptidao < Aptidao[i]) {
               for (j = 0; j < Elites.length; j++) {
                   if (i == Elites[j]) {
                       Presente = true;
                   }
               }
               if (Presente == false) {
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
