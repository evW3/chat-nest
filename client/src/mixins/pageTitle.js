function getTitle(vm) {
  const title = vm?.$options?.title;
  return (title) ? typeof title === 'function' ? title.call(vm) : title : title;
}

export const pageTitle = {
  created() {
    const title = getTitle(this);
    if(title) document.title = title;
  }
};