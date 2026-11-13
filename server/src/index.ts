// Serve static frontend files
const publicPath = process.env.NODE_ENV === 'production' 
  ? path.join(__dirname, '../public')
  : path.join(__dirname, '../../client/build');

app.use(express.static(publicPath));

// Fallback to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
