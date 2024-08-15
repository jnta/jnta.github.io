---
layout: post
title: Documentando decisões técnicas com RFC
date: 2024-08-15 20:00 -0300
categories: [Boas práticas]
tags: [documentation, rfc]
---

## O que é RFC?

RFC, ou Request for Comments, é um documento formal usado pela Internet Engineering Task Force (IETF) e pela Internet Society (ISOC) para descrever especificações, protocolos, procedimentos ou metodologias usadas na internet. Em termos mais simples, é uma maneira estruturada de documentar e compartilhar decisões técnicas.

## Como usar RFC para documentar decisões de projeto?

Seguindo o modelo adotado pelo time do Rust (https://github.com/rust-lang/rfcs), uma boa RFC pode ser estruturada da seguinte forma:

```markdown

- Start Date: YYYY-MM-DD
- Links relacionados

# Summary

Nesta seção, você deve destacar os principais pontos da RFC e fornecer um contexto geral sobre a mudança proposta.  

O objetivo é dar uma visão rápida e clara do que está sendo proposto e por quê.

# Motivation

Aqui, você identifica o problema que está tentando resolver e justifica a necessidade da mudança. 

É importante alinhar essa motivação com os Stakeholders, garantindo que todos entendam e concordem com a razão por trás da proposta.

# Detailed Design

Esta seção é onde a ideia abstrata se transforma em um plano concreto. 

Aqui, você deve detalhar como a mudança será implementada, abordando:

- Especificações técnicas
- Passos para a implementação
- Análise de impacto
- Casos extremos (edge cases) e considerações adicionais
- Possíveis dependências
- Diagramas e exemplos que ilustrem a proposta

# Alternatives

Depois de detalhar o plano de implementação, é essencial mostrar que outras abordagens foram consideradas. 

Nesta seção, inclua:

- Diferentes abordagens que poderiam ser adotadas
- Prós e contras de cada alternativa
- Justificativa para a abordagem escolhida
- Documentação do processo de tomada de decisão

# Unresolved Questions

Por fim, é importante ser transparente sobre as questões que ainda não foram resolvidas. 

Esta seção serve para:

- Encorajar discussões adicionais
- Documentar possíveis problemas em aberto
- Guiar o desenvolvimento futuro
- Alinhar expectativas em relação ao que ainda precisa ser decidido

```

Ao seguir esse modelo, você não só facilita a colaboração e a revisão, mas também garante que as mudanças sejam implementadas de maneira eficiente e bem fundamentada.