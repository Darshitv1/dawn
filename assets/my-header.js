// Get all the <ul> elements with the class "dropdown-child conten_of_list"
const parentUls = document.querySelectorAll('.dropdown-child.content_of_list');

// Loop through each parent <ul> element
parentUls.forEach((parentUl) => {
  // Get all the <li> elements with the class "menu-link-child" within the current parent <ul>
  const menuLinkChildElements = parentUl.querySelectorAll('.menu-link-child');

  // Create a new <div> element to wrap the selected <li> elements
  const wrapperDiv = document.createElement('div'); 
  wrapperDiv.classList.add('wrapper-class');

  // Loop through each <li> element
  menuLinkChildElements.forEach((li) => {
    // Check if the <li> element doesn't have a nested <ul> with the class "dropdown-grandchild"
    const hasGrandchildLinks = li.querySelector('.dropdown-grandchild');
    if (!hasGrandchildLinks) {
      // If it doesn't have grandchild links, append the <li> element to the wrapperDiv
      wrapperDiv.appendChild(li);
    }
  });

  // Append the wrapperDiv to the current parent <ul> element
  parentUl.appendChild(wrapperDiv);
});

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
