---
layout: post
title: Dockerizando uma aplicação Spring Boot com Gradle e multi-stage build
date: 2023-12-18 21:49 -0300
categories: [DevOps, Docker]
tags: [docker, gradle, spring_boot]
---
## O que é multi-stage build?

Sempre que criamos um <a href="https://docs.docker.com/engine/reference/builder/" target="_blank">Dockerfile</a> precisamos definir qual a imagem que vai servir como base para a nossa (fazemos isso por meio do comando *FROM*). Assim, podemos modificar a imagem base para atender as necessidades da nossa aplicação.

Contudo, provavelmente essa imagem terá bytes desnecessários à aplicação final, fazendo com que nosso container seja mais pesado do que necessitamos, impactando diretamente o tempo do build e execução.

Agora imagine se pudéssemos usar uma imagem completa, com todo o essencial ao build da aplicação, e, em cima dessa imagem, criar uma nova, utilizando um ambiente mínimo com somente o necessário para colocar o container de pé. Essa é a ideia do <a href="https://docs.docker.com/build/building/multi-stage/" target="_blank">multi-stage build</a>. 

Com isso, podemos separar o build em estágios, e, em cada estágio, utilizamos somente o que selecionarmos para o container final.


## Dockerfile

```Dockerfile
FROM gradle:jdk17 AS build

COPY --chown=gradle:gradle . /home/gradle/src

WORKDIR /home/gradle/src

RUN gradle build -x test

FROM eclipse-temurin:17-jre-alpine

EXPOSE 8080

RUN mkdir /app

COPY --from=build /home/gradle/src/build/libs/*.jar /app/spring-boot-application.jar

ENTRYPOINT ["java","-jar","/app/spring-boot-application.jar"]
```

## Decifrando o Dockerfile

Esse arquivo está separado em duas etapas, ou stages, se preferir.

- Etapa de **build**: Responsável por instalar as dependências do projeto, compilar o código e criar o JAR. Essa etapa pode ser realizada usando uma imagem base completa, como a imagem gradle:jdk17.

- Etapa de **run**: Responsável por utilizar JAR para iniciar a aplicação. Essa etapa pode ser realizada usando uma imagem base mínima, como a imagem eclipse-temurin:17-jre-alpine.

## Detalhes de alguns comandos

Definimos a imagem base e nomeamos o stage como build

```Dockerfile
FROM gradle:jdk17 AS build
```

Copiamos o conteúdo do diretório local para o container, garantindo o gradle como usuário proprietário do conteúdo copiado

```Dockerfile
COPY --chown=gradle:gradle . /home/gradle/src
```

Definimos a imagem final que a aplicação será executada

```Dockerfile
FROM eclipse-temurin:17-jre-alpine
```

Criamos uma pasta app no container

```Dockerfile
RUN mkdir /app
```

e copiamos o JAR gerado no stage anterior (build) para /app/spring-boot-application.jar

```Dockerfile
COPY --from=build /home/gradle/src/build/libs/*.jar /app/spring-boot-application.jar
```

Por fim, executamos a aplicação no container

```Dockerfile
ENTRYPOINT ["java","-jar","/app/spring-boot-application.jar"]
```

## Construindo a imagem

Para construir a imagem Docker, execute o seguinte comando no terminal:

```shell
docker build -t <nome-da-imagem> .
```

## Executando a imagem

Para executar a imagem Docker, execute o seguinte comando:
```shell
docker run -p 8080:8080 <nome-da-imagem>
```

Assim, a aplicação Spring Boot será iniciada na porta 8080.

## Conclusão

Dockerizar uma aplicação Spring Boot com Gradle e multi-stage build é uma tarefa relativamente simples. Ao seguir as etapas descritas neste texto, você pode criar imagens Docker que sejam eficientes e seguras.
