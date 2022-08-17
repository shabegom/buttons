const linkButton = (link: string): (() => void) => {
  return () => {
    window.open(link.trim(), "_blank");
  };
};

export default linkButton;
