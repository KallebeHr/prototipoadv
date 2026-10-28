<template>
  <SubHeader/>
  <Home/>
  <div class="page-flow">
    <Sobre/>
    <Equipe/>
    <Local/>
    <Areas/>
    <Depoimentos/>
    <Contatos/>
  </div>
  <Footers />
  
</template>

<script setup>


</script>

<style>
.page-flow{position:relative;background:linear-gradient(180deg,#fff 0%,#f7f6f3 35%,#fff 68%,#f7f6f3 100%);overflow:hidden}
.page-flow::before{content:'';position:absolute;inset:0;pointer-events:none;background:radial-gradient(circle at 10% 18%,rgba(183,154,101,.08),transparent 24%),radial-gradient(circle at 88% 62%,rgba(23,51,67,.055),transparent 26%)}
.page-flow>section{position:relative;background:transparent!important;padding-top:60px!important;padding-bottom:60px!important}
.page-flow>section+section{margin-top:-1px}
@media(max-width:700px){.page-flow>section{padding:46px 14px!important}}
</style>
