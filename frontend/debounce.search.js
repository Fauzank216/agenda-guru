export function debounce(fn, delay){
    let time;
       return function(...args){
       clearTimeout(time)
       time = setTimeout(() => fn(...args), delay)
    }
}
