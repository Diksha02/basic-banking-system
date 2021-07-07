const customer1Balance = $("#custBalance").val();
const transferAmount = $("#amount").val();
const recieverName = $("#recieverName").val();

window.onscroll = function () {
  scrollFunction();
};

function scrollFunction() {
  if (document.body.scrollTop > 50 || document.documentElement.scrollTop > 50) {
    $(".navbar").slideUp();
  } else {
    $(".navbar").slideDown();
  }
}

$(".transaction-form").submit((e) => {
  if (!recieverName) {
    alert("Select an account to transfer money to");
    e.preventDefault();
  }

  return;
});
