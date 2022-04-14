const http = require('http');
const app = require('./app');


/**function normalizePort pour renvoyer un port valide
 * si port est un nombre renvoi la valeur
 * et s'il est supérieur ou égale a 0 retourne le port
 * sinon retourne faux
 */
const normalizePort = val => {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        return val;
    } if (port >= 0) {
        return port;
    } return false;
};

/**On utilise le port de .env s'il est préciser 
 * sinon on utilisera par defaut le port 3000 
 * généralement utiliser pour du developpement
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**Gestion des erreurs 
 * si error.syscall different d'ecoute arrete et renvoi error
 * switch des erreurs
 * si la connexion a échouer pour non permission renvoi le msg d'erreur
 * si l'addresse est déjà utilisé
 * et default si aucun des cas n'est trouvé
*/
const errorHandler = error => {
    if (error.syscall !== 'listen') {
        throw error;
    }
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges.');
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use.');
            break;
        default:
            throw error;
    }
};

/**Ecoute du serveur
 * test s'il n'y a pas d'erreur en priorité
 * ecoute le serveur et renvoi le port utilisé
 */
const server = http.createServer(app);
server.on('error', errorHandler);
server.on('listening', () => {
    const address = server.address();
    const bind = typeof address === 'string' ? 'pipe' + address : 'port: ' + port;
    console.log('Listening on ' + bind);
});

server.listen(port);