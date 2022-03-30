const express = require('express');
const app = express();

app.use('/api/v1/', require('./routes/users.route'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server ON in port http://localhost:${PORT}`);
});
