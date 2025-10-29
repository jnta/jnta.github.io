---
layout: post
title: 'Números Binários, Bitwise e Bitshift'
date: 2025-10-22 19:20 -0300
math: true
---

É engraçado pensar que tudo o que a gente chama de computação se resume a dois símbolos: **0 e 1**.  
Por trás de toda a tecnologia que usamos no dia a dia, existe essa base simples chamada **sistema binário**.

Neste artigo, a ideia é entender de onde veio esse sistema, por que ele é tão importante e como ele acabou se tornando o alicerce de toda a lógica computacional.

## Do Decimal ao Binário

Binário, decimal, hexadecimal... todos são formas diferentes de representar a mesma coisa: números.  
A base decimal é a mais comum porque nasceu de uma limitação bem humana, a quantidade de dedos nas mãos. A contagem começou por aí.

Mas como surgiu a base Binária?

Existem registros de povos antigos, como os polinésios da ilha de Mangareva, que já usavam sistemas baseados em dois para facilitar cálculos comerciais. Mas quem realmente transformou o conceito em algo formal foi o filósofo e matemático alemão **Gottfried Wilhelm Leibniz**, no século XVII.

Leibniz se inspirou em um texto chinês chamado _I Ching_, que representava ideias opostas como yin e yang por meio de traços duplos e simples. Ele percebeu que podia aplicar o mesmo princípio à matemática: tudo poderia ser descrito usando apenas dois dígitos, 0 e 1.  
Em 1703, publicou o estudo que explicava esse sistema, mostrando como qualquer número podia ser construído a partir dessas duas unidades básicas.

No século XIX, **George Boole** criou a **Álgebra Booleana**, mostrando que a lógica podia ser expressa por operações com dois valores: verdadeiro e falso.  
Quase cem anos depois, **Claude Shannon** percebeu que a lógica de Boole podia ser representada fisicamente em circuitos elétricos, onde o estado ligado correspondia ao 1 e o desligado ao 0. A partir daí, a base binária virou o fundamento da computação moderna.

### Representação

A representação numérica em qualquer sistema posicional é baseada na soma dos valores de cada dígito, multiplicados pela potência da base correspondente à sua posição. É fácil perceber isso na base decimal:

```
403 = 4 × 10² + 0 × 10¹ + 3 × 10⁰
403 = 400 + 0 + 3
```

O mesmo princípio se aplica à base binária, onde cada bit é multiplicado por uma potência de 2:

```
0110 = 0 × 2³ + 1 × 2² + 1 × 2¹ + 0 × 2⁰
0110 = 0 + 4 + 2 + 0 = 6
```

### Conversão

O método mais comum e prático para converter um número decimal inteiro para binário é o **Método das Divisões Sucessivas por 2**. Este processo revela, em cada etapa, se a potência de 2 está "ligada" (1) ou "desligada" (0).

O princípio é simples: qualquer número inteiro pode ser totalmente decomposto pela soma de potências de $2$. O **resto** de cada divisão por $2$ indica se aquela potência está presente ($1$) ou ausente ($0$).

A resposta em binário é obtida **lendo a sequência dos restos de baixo para cima** (do último para o primeiro).

```
13 ÷ 2 = 6, resto 1  ↓
 6 ÷ 2 = 3, resto 0  ↓
 3 ÷ 2 = 1, resto 1  ↓
 1 ÷ 2 = 0, resto 1  ↓

13 em decimal = 1101 em binário
```

a solução da conversão em Java:

```java
public class DecimalToBinary {
    public static String convertToBinary(int decimal) {
        // 1. Caso Base: Se o número de entrada for 0, o binário é "0" por definição.
        // Isso evita que o loop seja executado desnecessariamente.
        if (decimal == 0) return "0";
        StringBuilder binary = new StringBuilder();
        
        // 2. Laço de Divisão Sucessiva: Continua enquanto o valor decimal
        // (o quociente atual) for maior que zero.
        while (decimal > 0) {
            
            // Passo A: Obtém o próximo bit.
            // O operador módulo (%) calcula o resto da divisão por 2 (que será 0 ou 1).
            // Este resto é o bit menos significativo (LSB) da etapa atual.
            int resto = decimal % 2;
            
            // Passo B: Insere o bit na posição correta.
            // O resto da divisão sucessiva é gerado do LSB para o MSB.
            // Ao usar 'insert(0, resto)', garantimos que a string seja montada
            // de trás para frente, resultando na ordem correta (MSB -> LSB).
            binary.insert(0, resto);
            
            // Passo C: Atualiza o valor decimal (o quociente).
            // O quociente inteiro é o novo dividendo para a próxima iteração.
            decimal = decimal / 2;
        }
        
        return binary.toString();
    }
    
    public static void main(String[] args) {
        // Teste 1: 13 em decimal deve ser 1101 em binário
        System.out.println("13 em binário: " + convertToBinary(13)); // Output: 1101
        
        // Teste 2: 6 em decimal deve ser 110 em binário
        System.out.println("6 em binário: " + convertToBinary(6));  // Output: 110
    }
}
```

## Bitwise Operations

As operações bitwise surgiram naturalmente a partir da própria forma como os computadores foram construídos.  
Quando os primeiros circuitos digitais começaram a ser projetados, cada componente elétrico só podia estar em dois estados: ligado ou desligado. Isso fazia com que os engenheiros trabalhassem diretamente com os bits, manipulando cada um deles para representar e processar informações.

Com o avanço da eletrônica e da lógica booleana, percebeu-se que era possível realizar cálculos e decisões apenas combinando esses estados binários. Assim nasceram as operações, que aplicam diretamente os princípios da álgebra booleana (AND, OR, XOR e NOT) sobre os bits de um número.

### AND (`&`)

#### Contexto

A operação **AND** compara dois bits e retorna 1 apenas quando **ambos** são 1.  
É uma forma direta de verificar se duas condições estão ativas ao mesmo tempo.

    `0101  (5)   & 0011  (3)   ------     0001  (1)`

| A   | B   | A & B |
| --- | --- | ----- |
| 0   | 0   | 0     |
| 0   | 1   | 0     |
| 1   | 0   | 0     |
| 1   | 1   | 1     |

O **AND** funciona como um controle de passagem:

- `a & 0` zera todos os bits (nada passa).
- `a & 1` preserva apenas os bits já ligados.

Essa operação é a base de várias otimizações em baixo nível, principalmente quando precisamos testar, limpar ou isolar bits específicos.

#### Como aplicar isso no dia a dia? 

Uma simples operação de conferir se um número é impar pode ser otimizada utilizando bitwise operation.

O segredo para saber se um número é par ou ímpar está sempre no seu **Bit Menos Significativo (LSB)**, ou seja, no dígito mais à direita.

Em qualquer sistema de numeração posicional, o valor de um número é determinado pela soma de seus dígitos multiplicados pela potência da base. No sistema binário (Base 2):

$$N = (\dots + D_2 \cdot 2^2 + D_1 \cdot 2^1) + D_0 \cdot 2^0$$

1. **Todas as potências de $2$ maiores que $2^0$** ($\dots, 2^2, 2^1$) sempre resultam em um **número par**.
    
    - Ex: $2^1 = 2$, $2^2 = 4$, $2^3 = 8$.
        
2. A única parte do número que pode ser ímpar é o termo $D_0 \cdot 2^0$, que é o LSB. Como $2^0 = 1$, o valor dessa posição é apenas $D_0$ (que será $0$ ou $1$).
    

Portanto:
- Se o **LSB for $0$**: A soma de (Número Par) + $0$ resulta em um **Número Par**.
- Se o **LSB for $1$**: A soma de (Número Par) + $1$ resulta em um **Número Ímpar**.
    
**Em termos de código:** Para isolar e verificar esse LSB, usamos a operação **AND Bit-a-Bit (`&`) com o número $1$** (que em binário é $\dots0001$).

Java

```java
public boolean isOdd(int n) {
    // Se o último bit (LSB) for 1, a operação retorna 1 (ou qualquer valor > 0), indicando ímpar.
    // Se o último bit (LSB) for 0, a operação retorna 0, indicando par.
    return (n & 1) == 1; 
}
```

Isso é mais rápido do que a divisão (`% 2`), pois o processador executa a operação **AND** em um único ciclo de máquina.

#### Algoritmo de Kernighan (`n & (n - 1)`)

A ideia é muito simples, apagar o LSB ativo, e se resume a como a subtração de 1 afeta a epresentação binária do número.

Quando subtraímos 1 de um número binário, o que o processador faz é inverter o estado de todos os bits a partir do primeiro 1 mais à direita.

Vamos tomar o número $N = 12$, que é $1100_2$:

| **Posição do Bit** | $2^3$ | $2^2$ | $2^1$        | $2^0$        |
| ------------------ | ----- | ----- | ------------ | ------------ |
| $N = 12$           | $1$   | $1$   | $\mathbf{0}$ | $\mathbf{0}$ |
| $N - 1 = 11$       | 1     | 0     | $\mathbf{1}$ | $\mathbf{1}$ |
| $N$ & $(N - 1)$    | $1$   | $0$   | 0            | 0            |

O padrão funciona porque a operação de subtração $N-1$ garante duas coisas essenciais:
1. **Preservação:** Deixa os bits mais significativos de $N$ exatamente como estavam.
2. **Inversão do Alvo:** Inverte o primeiro 1 mais à direita de $N$ para $0$, enquanto inverte os $0$s subsequentes para $1$.

Ao fazer o AND, combinamos a preservação da Esquerda ($1 \& 1$) com a Garantia de Zero na Direita ($1 \& 0$ e $0 \& 1$). O resultado é $N$ com um bit a menos.

#### LeetCode

Um bom exemplo de aplicabilidade desse padrão é um problema clássico do LeetCode, [191 - Number of bits 1](https://leetcode.com/problems/number-of-1-bits/description/), que como o nome sugere, o objetivo é contar a quantidade de bits ativos em um número.

```java
public class BitwiseCounter {

    public static int hammingWeight(int n) {
        int count = 0; 
        
        // Loop principal: Continua executando enquanto o número 'n' tiver pelo
        // menos um bit '1' ativo. Quando 'n' se torna 0, todos os bits '1'
        // originais foram apagados e o loop para.
        while (n != 0) {
            // A operação n & (n - 1) tem a propriedade única de apagar
            // *exatamente* o bit '1' mais à direita (o LSB ativo) em 'n'.
            n = n & (n - 1); 
            
            // Incrementa o contador. 
            // Como cada iteração do loop apaga EXATAMENTE um bit '1', 
            // este contador reflete o número de bits ativos originais.
            count++;
            
        } // O número de iterações deste loop é igual ao número de bits '1' em 'n'.
        
        // Retorna a contagem final.
        return count;
    }
}

```

### OR (`|`)

#### Contexto

Se o **AND** é o “filtro” que deixa passar apenas o que está ativo nos dois lados, o **OR** é o oposto, ele liga o bit se **qualquer um** dos dois bits estiver ligado.

Na prática, o **OR** compara dois bits e retorna `1` sempre que **pelo menos um** deles for `1`.

`0101 (5)   | 0011 (3)   ------   0111 (7)`

|A|B|A \| B|
|---|---|---|
|0|0|0|
|0|1|1|
|1|0|1|
|1|1|1|

O **OR** é perfeito quando precisamos **combinar estados** ou **ativar múltiplas flags** ao mesmo tempo.  
É uma operação que soma possibilidades, garantindo que nada “aceso” seja perdido no processo.

#### Um uso clássico: combinação de flags

Em sistemas que usam _bitmask_ (como drivers, engines de jogos ou configurações de permissões), o **OR** é usado para **ligar** bits específicos sem afetar os outros.

Imagine que cada bit de um número representa uma configuração:

|Bit|Valor|Função|
|---|---|---|
|0|1|Som ligado|
|1|2|Notificações|
|2|4|Vibração|
|3|8|Modo silencioso|

Agora suponha que queremos ativar **som** e **notificações** ao mesmo tempo:

`int SOUND = 1;          // 0001 int NOTIFICATIONS = 2;  // 0010  int settings = SOUND | NOTIFICATIONS; // 0011 (3)`

Esse simples `|` combina as duas configurações sem sobrescrever nada.  
Mais tarde, podemos continuar adicionando novas opções sem alterar as existentes:

`int VIBRATION = 4; // 0100 settings = settings | VIBRATION; // 0111 (7)`

Ou, de forma mais idiomática em Java:

`settings |= VIBRATION;`

#### LeetCode

[Bitwise ORs of Subarrays](https://leetcode.com/problems/bitwise-ors-of-subarrays/), Dado um array `arr` de inteiros não-negativos, calcule quantos valores distintos podem aparecer como OR bit a bit (`|`) de algum subarray de `arr`.  
Ou seja: para todas as subarrays possíveis, compute o OR de seus elementos e quantos resultados distintos existem.

Exemplo rápido: se `arr = [1,2,3]`, as subarrays e seus ORs são:

- `[1] -> 1`
    
- `[2] -> 2`
    
- `[3] -> 3`
    
- `[1,2] -> 1|2 = 3`
    
- `[2,3] -> 2|3 = 3`
    
- `[1,2,3] -> 1|2|3 = 3`  

Resultados distintos = `{1,2,3}` → resposta `3`.

##### Solução Ingênua

Antes de chegar à solução otimizada, vale entender o que exatamente estamos tentando evitar.  

A ideia seria:
1. Pegar **todos os subarrays possíveis** do array original.
2. Calcular o **OR** de cada uma.
3. Guardar todos esses resultados em um Set (para eliminar valores duplicados).
4. No fim, retornar o tamanho desse Set.

Em código, algo assim:

```java
public int subarrayBitwiseORs(int[] arr) {
    Set<Integer> result = new HashSet<>();

    for (int i = 0; i < arr.length; i++) {
        int current = 0;
        for (int j = i; j < arr.length; j++) {
            current |= arr[j]; // acumula o OR do subarray [i..j]
            result.add(current);
        }
    }

    return result.size();
}
```

Observações importantes extraídas do problema:

- `1 <= arr.length <= 5 * 10^4`.
- `0 <= arr[i] <= 10^9`.  

Esses limites implicam que uma solução O($n^2$) com ORs repetidos pode ser lenta, então precisamos evitar recalcular o OR de todos os subarrays novamente.

A sacada desse problema é perceber como o operador OR se comporta quando você adiciona novos elementos.

##### Solução Otimizada

O operador `|` é cumulativo no sentido de que **ele só liga mais bits**, nunca desliga.  
Se um bit é 1 em algum dos números, ele vai continuar sendo 1 no resultado, não importa o que venha depois. 

Isso abre um caminho interessante.

Imagina que estamos no índice `i` do array, olhando para o elemento `arr[i]`.  
Nosso objetivo é descobrir **quais valores de OR podem aparecer em subarrays que terminam exatamente aqui**.

Não precisamos recomeçar do zero toda vez.  
Tudo o que calculamos até o índice anterior (`i-1`) já contém as combinações possíveis de OR dos subarrays que terminavam ali, é como se tivéssemos um _cache_ dessas possibilidades.

Agora, pra descobrir as combinações novas em `i`, basta:

- pegar todos os valores que terminavam em `i-1`,
- aplicar `x | arr[i]` em cada um deles (ou seja, estender o subarray com o novo número),
- e também incluir o próprio `arr[i]`, que representa o subarray `[arr[i]]` sozinho.

Por exemplo:

```
ORs até i-1 = {1, 3}
arr[i] = 2  
Novos ORs = {1|2, 3|2, 2} = {3, 3, 2} → {2, 3}
```

Em outras palavras:  
tudo que **já existia** até `i-1` é reaproveitado, e só precisamos “propagar” os bits com o número atual.  
Isso evita recalcular os mesmos ORs repetidamente.


```java
import java.util.HashSet;
import java.util.Set;

public class BitwiseORsOfSubarrays {
    public int subarrayBitwiseORs(int[] arr) {
        // conjunto global com todos os ORs distintos encontrados (resposta final)
        Set<Integer> result = new HashSet<>();

        // conjunto com os ORs possíveis para subarrays que terminam na iteração anterior (i-1)
        Set<Integer> prev = new HashSet<>();

        // percorre cada elemento como fim do subarray
        for (int a : arr) {
            // novo conjunto para armazenar ORs de subarrays que terminam na posição atual
            Set<Integer> curr = new HashSet<>();

            // 1) O subarray que começa e termina no elemento atual: 
            curr.add(a);

            // 2) Para cada OR do subarray que terminava em i-1, 
            //    extendemos esse subarray com o elemento atual e calculamos o novo OR
            //    (equivale a considerar todos os subarrays que terminam em i e começam antes)
            for (int x : prev) {
                curr.add(x | a);
            }

            // 3) Todos os valores de 'curr' entram no conjunto global de resultados
            result.addAll(curr);

            // 4) Atualiza prev para a próxima iteração (i será i+1)
            prev = curr;
        }

        // o tamanho do conjunto global é a quantidade de ORs distintos possíveis
        return result.size();
    }

    public static void main(String[] args) {
        BitwiseORsOfSubarrays solver = new BitwiseORsOfSubarrays();
        int[] arr = {1, 2, 3};
        System.out.println(solver.subarrayBitwiseORs(arr)); // deve imprimir 3
    }
}

```

### XOR (`^`)

O XOR marca as diferenças entre dois números.
- Se os bits são iguais (0 e 0, ou 1 e 1) → resultado é 0.
- Se são diferentes (0 e 1, ou 1 e 0) → resultado é 1.
    
|A|B|A ^ B|
|---|---|---|
|0|0|0|
|0|1|1|
|1|0|1|
|1|1|0|

  `0101  (5) ^ 0011  (3)   ----   0110  (6)`

No exemplo acima, o resultado `0110` indica exatamente onde os bits de `5` e `3` divergem.

 o XOR é **reversível**, aplicar a mesma operação duas vezes com o mesmo número te leva de volta ao valor original:

`x ^ y ^ y = x`

Operações em pares se anulam, isso significa que:

`x ^ x = 0` e `x ^ 0 = x`

Ele é **associativo e comutativo**, ou seja, você pode mudar a ordem das operações à vontade.

#### Aplicações práticas

O **XOR**  aparece em criptografia, compressão e até em truques de entrevista técnica.

Um dos usos clássicos é trocar dois valores sem usar uma variável temporária:

```java
int a = 5; // 0101 
int b = 3; // 0011 
a = a ^ b; // a = 6 (0110) 
b = a ^ b; // b = 5 (0101) 
a = a ^ b; // a = 3 (0011)  
System.out.println("a = " + a + ", b = " + b);
```

#### LeetCode

[136 - Single Number](https://leetcode.com/problems/single-number/description/),  Dado um array onde todo número aparece duas vezes, exceto um — encontre esse número.

```java
public int singleNumber(int[] nums) {
    int result = 0;
    for (int n : nums) {
	    // Como números repetidos se anulam
	    // vai restar somente o número que é único
        result ^= n;
    }
    return result;
}
```


[268 - Missing Number](https://leetcode.com/problems/missing-number/description/), Dado um array contendo números de 0 a n, com um faltando, encontre o ausente.

Por exemplo:
`nums = [3, 0, 1]`
O número que falta é o `2`, certo?  

Até seria possível resolver esse problema utilizando a fórmula da soma dos primeiros $N$ números naturais, mas a ideia aqui é resolver sem usar soma, nem estruturas extras, Só lógica pura.

Partindo para a resolução do problema, a lógica é simples, o array devia conter:

`[0, 1, 2, 3]`

mas veio:

`[3, 0, 1]`

Se eu fizer XOR de todos os índices esperados (0, 1, 2, 3)  
e também de todos os números do array (3, 0, 1)**,  
os números que aparecerem nas duas listas se anulam.


```java
public int missingNumber(int[] nums) {
    int result = nums.length; // começa com n
    for (int i = 0; i < nums.length; i++) {
        result ^= i ^ nums[i];
    }
    return result;
}
```


### NOT (`~`)

O NOT é um **inversor**, cada bit que é `1` vira `0`, e cada `0` vira `1`.

|A|~A|
|---|---|
|0|1|
|1|0|

Um exemplo simples:

`A =  0101 (5) ~A = 1010 (-6)`

Sim, o resultado é `-6` e não `10`, mas por quê?


#### Complemento de dois

Para um número `x`, representado em `n` bits:

$$\text{Valor}(x) = 
\begin{cases} 
x & \text{se o bit mais à esquerda (MSB) for } 0 \\ 
x - 2^n & \text{se o bit mais à esquerda for } 1 
\end{cases}$$

Isso significa:

- `00000101` = 5
- `11111011` = 251 − 256 = **−5**
    

Ou seja, o bit mais significativo “diz” que aquele número é negativo.

Para obter o negativo de um número binário:
1. Inverta todos os bits (`~`)
2. Some 1

Qual o conceito por trás disso?

Antes dessa convenção, computadores antigos usavam representações como **sinal e magnitude** (um bit para o sinal e o resto para o valor). Isso funcionava mas complicava as operações aritméticas, principalmente subtrações.  
O complemento de dois foi uma forma de representar números negativos sem precisar criar regras novas de soma e subtração.

Matemáticamente, o computador trabalha com **n bits fixos**.  
Isso significa que ele só consegue representar números de `0` até `2ⁿ - 1`.

Por exemplo, com 8 bits:

```
0  →  00000000
255 → 11111111
```

Agora, queremos representar números **negativos** sem criar um novo bit de sinal (como o sistema “sinal e magnitude” fazia).  
A sacada do **complemento de dois** é reinterpretar esses mesmos 256 padrões binários (de 00000000 a 11111111) de modo que **a metade de cima** (128 a 255) represente números negativos.



Por que o $+1$ é Essencial?

1. **Eliminando o Zero Negativo:** No sistema de Complemento de Um, existem duas representações para o zero: $00\dots00$ (zero positivo) e $11\dots11$ (zero negativo). Isso desperdiça uma combinação de bits e complica o hardware. O sistema de Complemento de Dois elimina esse problema.
        
2. **Fechamento do Ciclo:** O $+1$ é o **ajuste de magnitude** que move a representação do Complemento de Um para a representação correta do Complemento de Dois. Ele garante que a soma de $x$ e seu oposto seja exatamente $2^n$, causando o _wrap-around_ (o "envolvimento" ou ciclo) que resulta em zero no sistema de $n$ bits.
    

|**Número (8 bits)**|**Valor Decimal**|**Binário**|
|---|---|---|
|**$x$**|$5$|$\mathbf{00000101}$|
|**$\sim x$** (Comp. de Um)|$-6$ (Não é $-5$!)|$11111010$|
|**$\sim x + 1$** (Comp. de Dois)|$-5$|$\mathbf{11111011}$|

Se tivéssemos usado apenas $\sim x$, a soma seria: $5 + (-6) = -1$. O **$+1$** corrige esse deslocamento de $1$, garantindo que a soma em $n$ bits seja precisamente $0$.



#### LeetCode

[476 - Number Complement](https://leetcode.com/problems/number-complement/description/), Dado um número positivo, encontre o complemento do seu binário, ou seja, inverta todos os bits significativos. 

**Exemplo:**

```
Input: 5   (101) 
Output: 2  (010)
```

**Ideia:**  
Aplicar o **NOT**, mas apenas sobre os bits usados pelo número original (sem afetar os zeros à esquerda), então usamos uma _máscara_ para limitar o escopo do `~`.


```java
public int findComplement(int num) {
    // Encontra o bit mais significativo (o mais alto) que está em 1.
    // Exemplo: num = 5 (101), Integer.highestOneBit(5) = 100 (4 em decimal)
    // Esse método já te dá direto o "limite" do número.

    // Faz um deslocamento de um bit à esquerda (<< 1).
    // Isso dobra o valor, ou seja: 100 << 1 = 1000 (8 em decimal).
    // Ainda não entramos em detalhes sobre bitshift operations, 
    // mas o conceito básico é que deslocar à esquerda é o mesmo que multiplicar por 2.
    // (Falaremos mais sobre isso mais adiante no artigo.)

    // Subtrai 1, para criar uma máscara com todos os bits 1 abaixo do bit mais alto.
    // 1000 - 1 = 0111 (7 em decimal)
    // Agora temos a máscara certa para o número: ela cobre apenas os bits “úteis” de num.
    int mask = (Integer.highestOneBit(num) << 1) - 1;

    // Aplica o operador NOT (~) em num, invertendo todos os bits.
    // ~101 → ...11111010 (lembrando que NOT inverte todos os bits, até os "fora" do número)
    // Por isso usamos a máscara para limpar o excesso e deixar só os bits relevantes.

    // O "& mask" faz exatamente isso: mantém apenas os bits válidos.
    // Exemplo:
    // num = 5 (101)
    // ~num = ...11111010
    // mask = 111
    // Resultado final: 010 (2)
    return ~num & mask;
}

```



## Bitshift Operations

São operações que deslocam os bits, para a esquerda ou direita.
Elas são fundamentais em programação de baixo nível, pois permitem manipular dados diretamente no nível binário. 

### Tipos de Deslocamento

Existem três tipos principais, que se diferenciam pelo modo como tratam os bits que são introduzidos na extremidade oposta durante o deslocamento:

#### 1. Deslocamento para a Esquerda (Left Shift $\ll$)
- **Como Funciona:** Todos os bits são movidos para a esquerda.
- **Preenchimento:** Novos bits $0$ (zero) são sempre introduzidos na extremidade direita (LSB).
- **Resultado:** Multiplica o número por uma potência de 2.

Imagine que você está adicionando valores do fim de um número na base decimal, deslocando-o para a esquerda. Perceba que, a cada vez que faz isso, na prática está multiplicando esse número por 10 elevado à quantidade de casas deslocadas.

```
423 -> 4230 (multiplicado por 10¹)
4230 -> 4200 (multiplicado por 10²)
```

O mesmo princípio se repete com números binários, mas aqui trocamos a base de 10 para 2.

```
5 em binário:     0101
5 << 1:          01010 = 10 (5 × 2¹)
5 << 2:         010100 = 20 (5 × 2²)
5 << 3:        0101000 = 40 (5 × 2³)
```

```java
public class LeftShiftExample {
    public static int multiplyByPowerOfTwo(int number, int power) {
        // Multiplicar por 2^power usando left shift
        return number << power;
    }
    
    public static void main(String[] args) {
        int num = 7;
        System.out.println(num + " << 1 = " + (num << 1)); // 14
        System.out.println(num + " << 2 = " + (num << 2)); // 28
        System.out.println(num + " << 3 = " + (num << 3)); // 56
        
        // Equivalente a 7 * 8 = 56
        System.out.println("7 × 8 = " + multiplyByPowerOfTwo(7, 3));
    }
}
```

#### 2. Deslocamento Lógico para a Direita (Logical Right Shift $\ggg$)

- **Como Funciona:** Todos os bits são movidos para a direita.
- **Preenchimento:** Novos bits $0$ (zero) são introduzidos na extremidade esquerda (MSB), independentemente do sinal do número.
- **Uso:** É usado principalmente com números **sem sinal (unsigned)**, ou quando você deseja garantir que o bit de sinal seja descartado.
    

Imagine a mesma analogia do sistema decimal: quando você remove o último dígito de um número, está realizando uma divisão inteira por $10$.

```
4230 -> 423 (divisão inteira por 10¹)
423 -> 42 (divisão inteira por 10²)
```

O Deslocamento Lógico para a Direita ($N \gg> M$ em Java) repete essa lógica, mas dividindo por potências de $2$ e preenchendo o espaço vazio com $0$.

```
40 em binário:    101000
40 >>> 1:        010100 = 20 (40 ÷ 2¹)
40 >>> 2:        001010 = 10 (40 ÷ 2²)
40 >>> 3:        000101 = 5 (40 ÷ 2³)
```

Note que, como a operação é uma **divisão inteira**, quaisquer restos são descartados (os bits que "caem" da direita).


```java
public class LogicalRightShiftExample {
    public static int divideByPowerOfTwo(int number, int power) {
        // Divide por 2^power usando logical right shift (>>> em Java)
        // Isso garante que os zeros preencham à esquerda, desconsiderando o sinal.
        return number >>> power;
    }
    
    public static void main(String[] args) {
        int num = 40;
        System.out.println(num + " >>> 1 = " + (num >>> 1)); // 20
        System.out.println(num + " >>> 2 = " + (num >>> 2)); // 10
        System.out.println(num + " >>> 3 = " + (num >>> 3)); // 5
        
        // Exemplo com divisão inteira (40 / 8 = 5)
        System.out.println("40 ÷ 8 = " + divideByPowerOfTwo(40, 3));
        
        // Demonstração com número negativo (onde o shift lógico é crucial):
        int negNum = -16; // Em 32-bit: 11111111 11111111 11111111 11110000
        // O deslocamento lógico preenche com zeros, alterando drasticamente o sinal:
        System.out.println(negNum + " >>> 1 (Lógico) = " + (negNum >>> 1)); // Saída: 2147483640 (Número positivo enorme!)
        
        // Isso confirma que o operador >>> *não* preserva o sinal do número.
    }
}
```

---

#### 3. Deslocamento Aritmético para a Direita (Arithmetic Right Shift $\gg$)

- **Como Funciona:** Todos os bits são movidos para a direita.
- **Preenchimento:** O bit da extremidade esquerda (o **Bit de Sinal** - MSB) é **replicado** para preservar o sinal do número.
- **Uso:** É a forma padrão de realizar uma **divisão inteira por potências de 2** para números **com sinal** (inteiros positivos ou negativos), mantendo o sinal do resultado.
    

Para números positivos, o Deslocamento Aritmético é idêntico ao Deslocamento Lógico, pois o bit de sinal é $0$ e o preenchimento também será $0$. A diferença aparece apenas com números negativos:

|**Número Decimal**|**Representação Binária (Exemplo 8-bit)**|**Deslocamento ≫1**|**Resultado Decimal**|
|---|---|---|---|
|**-16**|$\mathbf{1}111 \ 0000$|$\mathbf{1}111 \ 1000$|**-8** (Divisão inteira por 2)|
|**-8**|$\mathbf{1}111 \ 1000$|$\mathbf{1}111 \ 1100$|**-4** (Divisão inteira por 2)|

No Deslocamento Aritmético, o bit de sinal (**1** no caso do $-16$) é mantido na posição mais à esquerda para garantir que o resultado continue negativo ( $-16 / 2 = -8$ ).


```java
public class ArithmeticRightShiftExample {
    public static void main(String[] args) {
        int numPositivo = 40;
        int numNegativo = -16; 
        
        // 1. Para números positivos (Comportamento é igual ao Lógico)
        System.out.println(numPositivo + " >> 1 (Aritmético) = " + (numPositivo >> 1)); // 20
        
        // 2. Para números negativos (O bit de sinal é preservado)
        // Equivalente à divisão inteira por 2 (-16 / 2 = -8)
        System.out.println(numNegativo + " >> 1 (Aritmético) = " + (numNegativo >> 1)); // -8
        
        // Equivalente à divisão inteira por 4 (-16 / 4 = -4)
        System.out.println(numNegativo + " >> 2 (Aritmético) = " + (numNegativo >> 2)); // -4
        
        // Comparação com o Deslocamento Lógico (>>>):
        System.out.println(numNegativo + " >>> 1 (Lógico)   = " + (numNegativo >>> 1)); // 2147483640 (positivo)
    }
}
```


### Aplicabilidade

Essas operações, por serem manipulações diretas de bits, são consideravelmente mais eficientes do que fazer uma multiplicação ou divisão utilizando o módulo de cálculo da CPU.

Em problemas como [Divide Two Integers](https://leetcode.com/problems/divide-two-integers/) no LeetCode, você pode implementar divisão usando apenas shifts e subtrações:


