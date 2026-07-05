export function validateInput(){
     const inputs = Array.from(document.querySelectorAll('[data-rules]'))
     const invalidFeedBack = Array.from(document.querySelectorAll('.invalid-feedback'))
     let isValid = true
     inputs.forEach((input, i)=>{
         if(input.value == ''){
             isValid = false
             invalidFeedBack[i].style.display = 'block'
             setTimeout(()=>{
                invalidFeedBack[i].style.display = 'none'
             }, 2000)
         }
     })
     return isValid
}