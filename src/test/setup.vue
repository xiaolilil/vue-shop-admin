<template>
 <div class="test1">
     <p>vue3----组合式API</p>
     <p>setup</p>
     <p>============================</p>

        <strong>ref</strong>
    <p class="info">{{age}}</p>
     <button @click="add">获取名字</button>
     <p>------</p>
    <strong>reactive</strong>
    <p class="info">{{user}}</p>
    <button @click="increaseage">变小</button>
    <p>------</p>
    <strong>toRef</strong>
    <p>{{xm}}</p>
    <button @click="changeName">改名字</button>
    <p>------</p>
    <strong>toRefs</strong>
    <p>{{a}}----{{b}}</p>
    <button @click="changeV">change</button>
 </div>
</template>

<script>
  import { ref,reactive,toRef,toRefs  } from 'vue'
 export default {
     setup(){
         // 用于创建一个响应式数据，当数据发生改变时，Vue会自动更新UI
         // ref函数仅能监听基本类型的变化，不能监听复杂类型的变化（比如对象、数组）
         const age = ref(18);
         function add(){
             age.value++
         } 

        // reactive是用于复杂数据类型，比如对象和数组
         const user = reactive({name:'lisa',age:12})
         function increaseage(){
             user.age++
             user.name = '张三'
         }


         const info = reactive({names:'李四'})
         let xm = toRef(info, "names");
         /* 
            toRef接收两个参数， 第一个 参数是哪个对象，第二个 参数是对象的哪个属性
            toRef 一次仅能设置一个数据

            使用toRef将某个对象中的属性变成响应式数据，修改响应式数据是会影响到原始数据的。
            但是需要注意，如果修改通过toRef创建的响应式数据，并不会触发UI界面的更新。
            所以，toRef的本质是引用，与原始数据有关联
         */
         const changeName = () => {
             xm.value = '李五'
         }





         let obj = reactive({a:'abc',b:22});
        // toRefs接收一个对象作为参数，它会遍历对象身上的所有属性，然后挨个调用toRef执行
         let {a,b} = toRefs(obj);
        //  let newObj = toRefs(obj);
         function changeV(){
             a.value = 'tom';
             b.value++
         }





         return {age,user,xm,a,b, add,increaseage,changeName,changeV}
     }
 }
</script>

<style scoped>
.test1{
    color: red;
    padding-left: 100px;
}
.info{
    font-weight: bold;
    font-size: 18px;
    color: blueviolet;
}
</style>