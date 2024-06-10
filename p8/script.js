document.getElementById('maxForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
  

function translateCard(card) {
    const words = card.toLowerCase().split(" ");
    var v =0;
    let i;
    for( i=0; i<words.length; i++){
        console.log(i);
        if(words[i].length>v){v = words[i].length};
    }
    return v;
    // return translatedWords.join(" ");
}

// const englishCard = "Merry Christmas and Happy New Year";
const englishCard = document.getElementById('input1').value;
const swedishCard = translateCard(englishCard);

console.log(swedishCard);
    
    document.getElementById('result').textContent = `The maxword sentence is:  ${swedishCard}`;
});