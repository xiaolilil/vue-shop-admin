export const MUTATIONS_TYPE = {
    INCREASE: 'increase',
    DECREASE: 'decrease'
}
export default {
    // 让num累加 
    // playload是一个形参，如果组件在commit时，有传这个参数过来，就存在，如果没有传过来，就是undefined
    [MUTATIONS_TYPE.INCREASE](state, playload) {
        state.num += playload ? playload : 1;
    },
    // 让num累减
    [MUTATIONS_TYPE.DECREASE](state) {
        state.num--;
    }
}