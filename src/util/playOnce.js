export default function (animatedElement, animatedClass) {
  const animationEndEvent = [
    'webkitAnimationEnd',
    'mozAnimationEnd',
    'MSAnimationEnd',
    'oanimationend',
    'animationend',
  ];
  animatedElement.classList.add(animatedClass);
  animationEndEvent.forEach((event) => {
    animatedElement.addEventListener(event, function () {
      animatedElement.classList.remove(animatedClass);
    }, {once: true,});
  });
}
