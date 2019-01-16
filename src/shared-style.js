export const sharedStyle = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-size: 14px;
    font-family: Helvetica, Arial, sans-serif;
  }
  a:link {
    color: #490000;
  }
  a:visited {
    color: #828282;
  }
`;

document.head.appendChild(
  Object.assign(document.createElement("style"), {
    textContent: sharedStyle
  })
);
