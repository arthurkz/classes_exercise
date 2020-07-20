const modal = document.querySelector('.modal');
const cards = document.querySelectorAll('.card');
const modal_text = document.querySelector('.modal_text');

for (let card of cards){     
    card.addEventListener('click', function(){
        const cardId = card.getAttribute('id');
        const cardH2 = card.querySelector('h2').innerHTML;
        const cardParagraph = card.querySelector('p').innerHTML;

        modal.classList.add('active');
        modal_text.querySelector('h2').innerHTML = cardH2;
        modal_text.querySelector('p').innerHTML = cardParagraph;

        modal.querySelector('img').src = `/img/${cardId}`;
    });
};

document.querySelector('.close_modal').querySelector('p').addEventListener('click', function () {
   modal.classList.remove('active') 
});