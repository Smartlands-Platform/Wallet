export const downloadDeskBuild = (platform) => {
    const a = document.createElement('a');
    a.href = `/builds/${platform}`;
    a.download = `app${platform}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
};
