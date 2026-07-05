import { states } from "./src/state.js"

export function setLoading(isLoading){
    states.isLoading = isLoading
    const loadingSpinner = document.querySelector('.loading-container')
    if(states.isLoading){
        loadingSpinner.style.display = 'flex'
    }else{
        loadingSpinner.style.display = 'none'
    }
}