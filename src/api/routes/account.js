const upload = require('../../middlewares/file');
const { createAccount, getAccount, updateAccount, deleteAccount, getAllAccounts } = require('../controllers/account');

const accountRouter = require('express').Router();


accountRouter.post('/', upload.single("profilePicture"), createAccount);
accountRouter.get('/', upload.single("profilePicture"), getAllAccounts);
accountRouter.get('/:id', upload.single("profilePicture"), getAccount);
accountRouter.put('/:id', updateAccount);
accountRouter.delete('/:id', deleteAccount);

module.exports = accountRouter;
