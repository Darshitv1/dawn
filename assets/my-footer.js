const acc_btn = document.querySelectorAll('.accordionx');
console.log(acc_btn);
const panel_list = document.querySelector('.panelx');
console.log(panel_list);

acc_btn.forEach((btn) => {
  btn.addEventListener('click', () => {
    let next_list = btn.nextElementSibling;
    console.log(next_list);
    next_list.classList.toggle('display_class_x');
  });
});

const acc_btn_new = document.querySelector('.accordiony');
console.log(acc_btn_new);
const para_div = document.querySelector('.para_div');
console.log(para_div);

acc_btn_new.addEventListener('click', () => {
  para_div.classList.toggle('display_class_x');
});
