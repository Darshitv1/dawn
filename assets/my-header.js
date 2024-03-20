const toggle_btn = document.querySelector('.drawer__close-button');
const navbar = document.querySelector('#NavDrawer');
const hamburger = document.querySelector('.hamburger_icon');
const pos = document.querySelectorAll('#megameni-id');
console.log(pos);
pos.forEach((button) => {
  let parent = button.parentElement;
  console.log(parent);
  parent.classList.add('position');
});
// const dropbtn = document.querySelectorAll('.dropbtn');

// const parent = pos.parentElement;
// parent.classList.add('position');

toggle_btn.addEventListener('click', () => {
  navbar.style.display = 'none';
});

hamburger.addEventListener('click', () => {
  navbar.style.display = 'block';
});

// const sub_ll = document.querySelector('#Sublinklist');
var acc = document.getElementsByClassName('accordion_header');
var i;
for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener('click', function () {
    this.classList.toggle('active');
    var panel = this.nextElementSibling;
    if (panel.style.display === 'block') {
      panel.style.display = 'none';
    } else {
      panel.style.display = 'block';
    }
  });
}

const down_btn = document.querySelectorAll('.collapsible-trigger-main-down');
console.log(down_btn);
const link_list = document.querySelector('#Linklist');

down_btn.forEach((btn) => {
  btn.addEventListener('click', () => {
    let next_s = btn.nextElementSibling;
    console.log(next_s);
    next_s.classList.toggle('display_class');
  });
});
