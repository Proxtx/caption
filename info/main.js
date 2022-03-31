const fonts = navigator.fonts.query();
try {
  for await (const metadata of fonts) {
    alert(`${metadata.family} (${metadata.fullName})`);
  }
} catch (err) {
  console.error(err);
}
