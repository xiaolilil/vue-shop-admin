
<template>
<router-view></router-view>
</template>


<style lang="less">
*{
    margin: 0;
    padding: 0;
}
html, body{
    width: 100%;
    height: 100%;
    background-color: #eee;
}
#app{
    width: 100%;
    height: 100%;
}
    :deep(.el-dialog__body){
        padding: 10px 50px   !important;
    }
</style>
