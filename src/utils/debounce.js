export function debounce(fn, wait) {
    let timeout = null
    return function() {
        if(timeout){
        clearTimeout(timeout)
        }     
        timeout = setTimeout(fn, wait);
    }
}