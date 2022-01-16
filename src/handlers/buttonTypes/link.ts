const linkButton = (link: string) => {
  return () => {
    window.open(link.trim(), '_blank');
  };
}

export default linkButton;
