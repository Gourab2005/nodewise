/**
 * errorPatterns.js
 * 
 * Central repository of error patterns and explanations.
 * This is used by the normal mode explainer to identify and explain common errors.
 * 
 * Pattern format:
 * {
 *   name: "ERROR_NAME",
 *   match: /regex pattern/,
 *   explain: (error) => "explanation string"
 * }
 * 
 * Easy to extend: just add more patterns to the array.
 * Can be moved to a database or external config later.
 */

const errorPatterns = [
  // Module and import errors
  {
    name: "MODULE_NOT_FOUND",
    match: /Cannot find module|MODULE_NOT_FOUND/i,
    explain: (error) => `
This error occurs when you try to import or require a file or package that doesn't exist.

Common causes:
- Typo in the module name or path
- Package not installed (missing from node_modules)
- Incorrect relative path

Solution:
1. Check the spelling of the module name
2. If it's a package, run: npm install <package-name>
3. Verify the file path if using relative imports
    `.trim()
  },

  {
    name: "REFERENCE_ERROR",
    match: /ReferenceError|is not defined/i,
    explain: (error) => `
You're trying to use a variable that doesn't exist or hasn't been declared.

Common causes:
- Variable name typo
- Variable used before declaration
- Variable declared in a different scope
- Missing 'require' or 'import' statement

Solution:
1. Check spelling of variable names
2. Ensure variable is declared before using it
3. Check variable scope (is it defined in the right block?)
4. Make sure you've imported/required dependencies
    `.trim()
  },

  {
    name: "TYPE_ERROR",
    match: /TypeError|Cannot read property|Cannot read properties/i,
    explain: (error) => `
You're trying to call a method or access a property on something that doesn't have it.

Common causes:
- Accessing property on null or undefined
- Calling a method on non-object type
- Wrong method name

Solution:
1. Add null/undefined checks: if (obj && obj.property)
2. Use optional chaining: obj?.property or obj?.method?.()
3. Verify the object has the method you're calling
4. Check API documentation for correct method names
    `.trim()
  },

  {
    name: "SYNTAX_ERROR",
    match: /SyntaxError|Unexpected token|Unexpected identifier/i,
    explain: (error) => `
There's a syntax error in your JavaScript code - something is written incorrectly.

Common causes:
- Missing closing bracket, parenthesis, or brace
- Incorrect operator usage
- Invalid JSON being parsed
- Mixing tabs and spaces (in some cases)

Solution:
1. Look at the line number mentioned in the error
2. Check for missing brackets: {}, (), []
3. Verify semicolons where required
4. Use a code formatter like Prettier to auto-fix formatting
    `.trim()
  },

  {
    name: "EADDRINUSE",
    match: /EADDRINUSE|address already in use|Port .* is already in use/i,
    explain: (error) => `
The port you're trying to bind to is already in use by another process.

Common causes:
- Another instance of your app is running
- Another service is using that port
- Previous process didn't fully close

Solution:
1. Find and kill the process using the port:
   On Mac/Linux: lsof -i :PORT_NUMBER | grep LISTEN | awk '{print $2}' | xargs kill
   On Windows: netstat -ano | findstr :PORT_NUMBER
2. Change port in your code: process.env.PORT || 3000
3. Use dynamic port: const port = 3000, then increment if in use
    `.trim()
  },

  {
    name: "ECONNREFUSED",
    match: /ECONNREFUSED|Connection refused|ECONNREFUSED.*127\.0\.0\.1/i,
    explain: (error) => `
Connection was refused - the server you're trying to connect to isn't running or listening.

Common causes:
- Database server isn't running (MongoDB, PostgreSQL, etc.)
- API server isn't started
- Wrong host or port
- Firewall blocking connection

Solution:
1. Verify the server is running on the correct port
2. Check host and port configuration
3. Add connection error handling:
   client.on('error', (err) => console.error('Cannot connect'))
4. Use retry logic for resilience
    `.trim()
  },

  {
    name: "EACCES",
    match: /EACCES|permission denied|Error: EACCES/i,
    explain: (error) => `
Permission denied - you don't have permission to access a file or resource.

Common causes:
- Insufficient file permissions
- Running without required privileges
- Reading/writing to protected directory

Solution:
1. Check file/folder permissions: ls -l (Mac/Linux)
2. Change permissions: chmod +x filename
3. Run with sudo if necessary (last resort)
4. Ensure app runs with correct user permissions
    `.trim()
  },

  {
    name: "ENOENT",
    match: /ENOENT|no such file or directory|ENOENT.*no such file/i,
    explain: (error) => `
The file or directory you're trying to access doesn't exist.

Common causes:
- Wrong file path
- File hasn't been created yet
- File was deleted
- Typo in filename

Solution:
1. Verify the file path exists
2. Check if file is created before reading: fs.existsSync(path)
3. Use absolute paths instead of relative
4. Ensure the directory exists before creating files
    `.trim()
  },

  {
    name: "ERR_HTTP_HEADERS_SENT",
    match: /ERR_HTTP_HEADERS_SENT|Cannot set headers after they are sent/i,
    explain: (error) => `
You tried to send headers or response twice in the same HTTP request.

Common causes:
- Calling res.send() twice
- Calling res.end() after already sending response
- Multiple res.redirect() calls
- No return after res.send()

Solution:
1. Add return after res.send(): return res.send(data)
2. Use if/else to ensure response is sent only once
3. Check for early return: if (condition) { return res.send() }
4. Use middleware properly - don't send response in multiple places
    `.trim()
  },

  {
    name: "JSON_PARSE_ERROR",
    match: /JSON\.parse|Unexpected token.*JSON|SyntaxError.*JSON/i,
    explain: (error) => `
The JSON string you're trying to parse is invalid or malformed.

Common causes:
- Invalid JSON syntax (trailing commas, missing quotes)
- Trying to parse non-JSON string
- Incomplete JSON data
- Incorrect escaping

Solution:
1. Validate JSON before parsing: try/catch around JSON.parse()
2. Check JSON syntax (use jsonlint.com)
3. Use error handling:
   try { JSON.parse(str) } catch(e) { console.error('Invalid JSON') }
4. Ensure complete data is received before parsing
    `.trim()
  },

  {
    name: "MAXIMUM_CALL_STACK_EXCEEDED",
    match: /Maximum call stack size exceeded|stack overflow|RangeError/i,
    explain: (error) => `
Infinite recursion or very deeply nested loops - your function called itself too many times.

Common causes:
- Infinite recursion without base case
- Circular dependencies
- Deep chains of async operations
- Event emitter loops

Solution:
1. Check recursive functions have a base case
2. Ensure recursion terminates
3. Use iteration instead of recursion for large datasets
4. Increase stack size if needed (not recommended): node --stack-size
    `.trim()
  },

  {
    name: "UNHANDLED_PROMISE_REJECTION",
    match: /UnhandledPromiseRejectionWarning|unhandledRejection|Promise rejection was not handled/i,
    explain: (error) => `
A Promise was rejected but there's no .catch() handler to handle the error.

Common causes:
- Missing .catch() after .then()
- Missing await or Promise error handling
- Async function error not caught
- Event listener not added

Solution:
1. Add .catch() to all Promise chains
2. Use try/catch with async/await:
   try { await asyncFunction() } catch(e) { }
3. Add error handler to event emitters
4. Use process.on('unhandledRejection', handler)
    `.trim()
  },

  {
    name: "UNEXPECTED_TOKEN",
    match: /Unexpected token|Unexpected identifier|SyntaxError: Unexpected/i,
    explain: (error) => `
The parser encountered unexpected syntax it didn't expect.

Common causes:
- Missing or extra brackets
- Using reserved keywords incorrectly
- Mixing import/require syntax
- HTML/non-JS in JS file

Solution:
1. Look at the line number in the error
2. Check for balanced brackets: {}, [], ()
3. Use consistent import syntax (all import or all require)
4. Check file encoding and format
    `.trim()
  },

  {
    name: "ECONNRESET",
    match: /ECONNRESET|Connection reset|socket hang up/i,
    explain: (error) => `
The connection was reset - the remote server or client closed the connection unexpectedly.

Common causes:
- Server crashed or restarted
- Network connection dropped
- Timeout - connection idle too long
- Client forcefully closed connection

Solution:
1. Add connection error handling:
   socket.on('error', (err) => console.error('Connection error'))
2. Implement retry logic with exponential backoff
3. Check for timeouts: socket.setTimeout()
4. Monitor server logs for crashes
    `.trim()
  },

  {
    name: "MONGO_NETWORK_ERROR",
    match: /MongoNetworkError|MongoDB server selection failed|getaddrinfo.*mongodb/i,
    explain: (error) => `
Cannot connect to MongoDB - network or database connection issue.

Common causes:
- MongoDB server not running
- Wrong connection string
- Database server unreachable
- Firewall blocking connection
- Wrong credentials

Solution:
1. Verify MongoDB is running
2. Check connection string in .env or config
3. Ensure IP/hostname is correct and accessible
4. Add connection retries:
   useNewUrlParser: true, useUnifiedTopology: true
5. Check MongoDB cloud Atlas firewall rules if using cloud
    `.trim()
  },

  {
    name: "MONGOOSE_VALIDATION_ERROR",
    match: /ValidationError|Mongoose|validation failed|Cast to.*failed/i,
    explain: (error) => `
MongoDB/Mongoose rejected data because it doesn't match your schema definition.

Common causes:
- Required field missing
- Data type mismatch
- Custom validator failed
- Invalid ObjectId

Solution:
1. Check all required fields are provided
2. Ensure data types match schema
3. Validate ObjectIds before querying
4. Add debug logging to see what field failed
5. Use schema validation: const schema = new Schema({ ... })
    `.trim()
  },

  {
    name: "EXPRESS_ROUTE_NOT_FOUND",
    match: /Cannot GET|Cannot POST|Cannot PUT|Cannot DELETE|404.*not found/i,
    explain: (error) => `
Express couldn't find a route handler that matches this HTTP request.

Common causes:
- Route not defined
- Wrong HTTP method (GET vs POST)
- URL path typo
- Route defined after app.listen()
- Missing middleware

Solution:
1. Verify route exists: app.get('/path', ...)
2. Check HTTP method matches (GET, POST, PUT, DELETE)
3. Add 404 handler at end: app.use((req, res) => res.status(404))
4. Use app.all('*') for catch-all
5. Ensure routes defined before app.listen()
    `.trim()
  },

  {
    name: "CORS_ERROR",
    match: /CORS|Access-Control-Allow-Origin|Cross-Origin/i,
    explain: (error) => `
Cross-Origin Resource Sharing (CORS) error - browser blocked request from different domain.

Common causes:
- CORS headers not set
- Frontend and backend on different origins
- Browser security policy
- Credentials not allowed

Solution:
1. Install and use cors: npm install cors
2. Add to Express: const cors = require('cors'); app.use(cors())
3. Or configure specific origins:
   app.use(cors({ origin: 'http://localhost:3000' }))
4. For credentials: credentials: true
    `.trim()
  },

  {
    name: "RATE_LIMIT_ERROR",
    match: /rate limit|too many requests|429|throttle/i,
    explain: (error) => `
You've exceeded the rate limit - too many requests in a short time.

Common causes:
- API rate limit exceeded
- Too many concurrent requests
- Requesting same endpoint repeatedly
- No backoff/delay between requests

Solution:
1. Implement rate limiting: npm install express-rate-limit
2. Add delay between requests: await new Promise(r => setTimeout(r, 1000))
3. Use exponential backoff for retries
4. Check API documentation for limits
5. Cache responses to reduce requests
    `.trim()
  },

  {
    name: "MEMORY_LEAK_ERROR",
    match: /heap out of memory|JavaScript heap out of memory|FATAL/i,
    explain: (error) => `
Node.js ran out of memory - likely a memory leak or insufficient heap allocation.

Common causes:
- Event listeners not cleaned up
- Circular references
- Large objects not garbage collected
- Unbounded cache/arrays
- Too many connections

Solution:
1. Check for memory leaks using clinic.js or node inspect
2. Clean up event listeners: emitter.removeListener()
3. Limit cache size: implement LRU cache
4. Close connections properly
5. Increase heap: node --max-old-space-size=4096 app.js
    `.trim()
  },

  {
    name: "TIMEOUT_ERROR",
    match: /timeout|ETIMEDOUT|timed out|deadline exceeded/i,
    explain: (error) => `
Operation took too long and was cancelled - timeout exceeded.

Common causes:
- Network request too slow
- Database query too slow
- Operation genuinely taking long time
- Server not responding

Solution:
1. Increase timeout if needed: setTimeout seems too short
2. Use Promise.race() with timeout:
   Promise.race([operation, timeoutPromise])
3. Optimize slow queries/requests
4. Add error handling with graceful fallback
5. Monitor performance with profiling tools
    `.trim()
  },

  {
    name: "FILE_ALREADY_EXISTS",
    match: /EEXIST|File already exists|file exists/i,
    explain: (error) => `
You're trying to create a file that already exists.

Common causes:
- Re-running script that creates files
- Not checking if file exists before creating
- Race condition with concurrent writes

Solution:
1. Check if file exists: fs.existsSync(path)
2. Use flags appropriately: 'w' (overwrite), 'wx' (fail if exists)
3. Handle error gracefully:
   if (fs.existsSync(file)) { fs.unlinkSync(file) }
4. Use callback: fs.writeFile(path, data, (err) => { })
    `.trim()
  },

  {
    name: "INVALID_ARGUMENT_ERROR",
    match: /ERR_INVALID_ARG_TYPE|ERR_INVALID_ARG|Invalid argument/i,
    explain: (error) => `
You passed an invalid argument to a function - wrong type or value.

Common causes:
- Wrong data type (string instead of number)
- Null/undefined where object expected
- Out of range value
- Invalid option object

Solution:
1. Check function documentation for expected types
2. Validate arguments before calling:
   if (typeof x !== 'number') throw new Error('Expected number')
3. Use TypeScript for type safety
4. Add JSDoc comments to document expected types
    `.trim()
  },

  {
    name: "ENOMEM",
    match: /ENOMEM|Cannot allocate memory|out of memory/i,
    explain: (error) => `
The system is out of memory - no more memory available.

Common causes:
- Memory leak accumulating
- Process using too much memory
- System low on overall memory
- Infinite loops creating data

Solution:
1. Check memory usage: ps aux (Mac/Linux) or Task Manager (Windows)
2. Profile memory: node --inspect-brk app.js
3. Reduce memory usage in application
4. Implement memory limits or pagination
5. Check for unbounded data structures
    `.trim()
  },

  {
    name: "PORT_NOT_NUMERIC",
    match: /port should be >= 0|port is not a number|ERR_SOCKET_BAD_PORT/i,
    explain: (error) => `
The port number is invalid - must be a number between 0 and 65535.

Common causes:
- Port is a string not a number
- Port less than 0 or greater than 65535
- Port is NaN or undefined

Solution:
1. Ensure port is a number: const port = parseInt(process.env.PORT) || 3000
2. Validate range: if (port < 0 || port > 65535) throw Error
3. Parse from environment variables correctly
4. Use defaults: port || 3000
    `.trim()
  },

  {
    name: "ECONNABORTED",
    match: /ECONNABORTED|Connection aborted|socket destroyed/i,
    explain: (error) => `
The connection was aborted - closed during communication.

Common causes:
- Client closed connection mid-request
- Server forcefully closed socket
- Network interruption
- Timeout during transfer

Solution:
1. Add error handlers: socket.on('error', handler)
2. Implement connection pooling
3. Add retry logic for aborted connections
4. Use keep-alive: agent: new http.Agent({ keepAlive: true })
    `.trim()
  },

  {
    name: "EMIT_AFTER_CLOSE",
    match: /write after end|ERR_STREAM_DESTROYED|Destroyed stream/i,
    explain: (error) => `
You're trying to write to a stream that has already been closed/destroyed.

Common causes:
- Writing to closed file/stream
- Writing after .end() called
- Double closing
- Race condition

Solution:
1. Check stream state before writing
2. Use .once() or .on() but not after .end()
3. Call .end() only once:
   stream.end(() => { })
4. Buffer data and write before close
    `.trim()
  },

  {
    name: "REQUIRE_CYCLE",
    match: /circular.*require|require.*cycle|Cannot find module/i,
    explain: (error) => `
Circular dependency detected - files require each other creating a loop.

Common causes:
- File A requires File B, File B requires File A
- Deep circular dependency chains
- Shared exports

Solution:
1. Restructure code to break circle
2. Use lazy requires: require() inside function, not top-level
3. Extract shared code to third file
4. Check import graph: npm install circular-dependency-plugin
    `.trim()
  },

  {
    name: "BUFFER_ENCODING_ERROR",
    match: /Unknown encoding|ERR_UNKNOWN_ENCODING|not a valid encoding/i,
    explain: (error) => `
Invalid character encoding specified - not a recognized encoding.

Common causes:
- Typo in encoding name
- Unsupported encoding
- Wrong encoding for data

Solution:
1. Use valid encodings: utf8, utf16le, ascii, latin1, base64, hex
2. Common encoding is 'utf8' (default)
3. Check documentation for correct encoding name
4. Convert between encodings if needed: buffer.toString('utf8')
    `.trim()
  },

  {
    name: "INVALID_PROTOCOL",
    match: /Invalid protocol|ERR_INVALID_PROTOCOL|protocol.*invalid/i,
    explain: (error) => `
Invalid URL protocol specified - must be http:, https:, ftp:, etc.

Common causes:
- URL missing protocol
- Wrong protocol in URL
- Spaces or invalid characters

Solution:
1. Ensure URL includes protocol: 'https://...' not just '...'
2. Use new URL() to parse and validate
3. Common protocols: http:, https:, ftp:, file:
4. Check URL format: new URL('https://example.com')
    `.trim()
  },

  {
    name: "ERR_MODULE_NOT_FOUND",
    match: /ERR_MODULE_NOT_FOUND|Cannot find.*module|ERR_PACKAGE_PATH_NOT_EXPORTED/i,
    explain: (error) => `
The module or export you're trying to import doesn't exist.

Common causes:
- Package not installed
- Wrong export name
- Wrong file path
- Package incompatible with Node version

Solution:
1. Install missing package: npm install package-name
2. Check exact export name: check package.json "exports" field
3. Use correct import syntax
4. Verify package version supports your Node version
    `.trim()
  },

  {
    name: "ERR_SCRIPT_NOT_FOUND",
    match: /ERR_SCRIPT_NOT_FOUND|npm run.*not found|Unknown script/i,
    explain: (error) => `
The npm script you're trying to run doesn't exist in package.json.

Common causes:
- Script not defined in package.json
- Typo in script name
- Wrong project directory

Solution:
1. Check package.json scripts section
2. Add the script: "start": "node app.js"
3. Run scripts with: npm run script-name
4. List available scripts: npm run
    `.trim()
  },

  {
    name: "EPERM",
    match: /EPERM|operation not permitted|permission denied/i,
    explain: (error) => `
Operation not permitted - insufficient permissions for this action.

Common causes:
- File/directory permissions too restrictive
- Trying to write to read-only file
- Trying to delete protected file
- Running as wrong user

Solution:
1. Fix permissions: chmod +w filename (Mac/Linux)
2. Check file owner: ls -l (Mac/Linux)
3. Run as correct user
4. Use sudo if necessary (be cautious)
    `.trim()
  },

  {
    name: "EISDIR",
    match: /EISDIR|Illegal operation on a directory|Is a directory/i,
    explain: (error) => `
You're trying to use a directory where a file is expected, or vice versa.

Common causes:
- Trying to read a directory as file
- fs.readFile() given directory path
- Wrong path type

Solution:
1. Check if path is directory: fs.lstatSync(path).isDirectory()
2. Use correct fs method: fs.readdir() for directories
3. Verify path in code matches actual file/directory
    `.trim()
  },

  {
    name: "ENOTDIR",
    match: /ENOTDIR|not a directory|ENOTDIR/i,
    explain: (error) => `
You're trying to use a file where a directory is expected.

Common causes:
- Path should point to directory but doesn't
- File deleted or renamed
- Wrong path structure

Solution:
1. Verify directory exists
2. Create directory if needed: fs.mkdirSync(path, { recursive: true })
3. Check full path is correct
4. Ensure intermediate directories exist
    `.trim()
  },

  {
    name: "ENVFILE_NOT_FOUND",
    match: /\.env.*not found|no such file.*\.env/i,
    explain: (error) => `
.env configuration file not found - needed for environment variables.

Common causes:
- .env file missing
- Wrong working directory
- Gitignored .env not created

Solution:
1. Create .env file in project root
2. Use env package: require('dotenv').config()
3. Copy from .env.example if exists: cp .env.example .env
4. Add to .gitignore: echo '.env' >> .gitignore
    `.trim()
  },

  {
    name: "SSL_CERTIFICATE_ERROR",
    match: /SSL|certificate|SSL_ERROR|unable to verify|self signed/i,
    explain: (error) => `
SSL/TLS certificate error - security certificate issue.

Common causes:
- Self-signed certificate
- Expired certificate
- Certificate mismatch
- Wrong hostname

Solution:
1. For development, disable SSL check (NOT for production):
   process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
2. Use valid certificate for production
3. Check certificate expiry
4. Use LetsEncrypt for free certificates
    `.trim()
  },

  {
    name: "HEADER_OVERFLOW",
    match: /ERR_HTTP_HEADERS_OVERFLOW|Headers overflow|header.*too large/i,
    explain: (error) => `
HTTP headers exceeded size limit - too much header data.

Common causes:
- Too many cookies
- Large headers in request
- Headers not cleaned up

Solution:
1. Reduce number/size of cookies
2. Compress headers
3. Use configure max header size:
   --max-http-header-size=16384
    `.trim()
  },

  {
    name: "STREAM_DESTROYED",
    match: /stream destroyed|Writable stream error|destroyed stream/i,
    explain: (error) => `
Attempting to use a stream that has been destroyed/closed.

Common causes:
- Writing to closed stream
- Stream destroyed before operation
- Pipe to destroyed stream

Solution:
1. Check stream state: if (!stream.destroyed)
2. Add error handlers: stream.on('error', handler)
3. Don't reuse destroyed streams
4. Clean up properly: stream.destroy()
    `.trim()
  },

  {
    name: "INVALID_URL",
    match: /Invalid URL|ERR_INVALID_URL|URL.*invalid/i,
    explain: (error) => `
The URL format is invalid or malformed.

Common causes:
- Missing protocol (http://, https://)
- Invalid characters in URL
- Space or special character not encoded
- Malformed query string

Solution:
1. Use new URL() to validate: new URL('https://example.com')
2. Encode special characters: encodeURIComponent()
3. Include protocol: https://example.com
4. Use try/catch for URL validation
    `.trim()
  },

  {
    name: "ABORT_CONTROLLER_ERROR",
    match: /AbortError|abort.*signal|signal.*aborted/i,
    explain: (error) => `
Operation was aborted using AbortController signal.

Common causes:
- User cancelled operation
- Timeout triggered abort
- Request cancelled before completion

Solution:
1. Handle AbortError properly:
   if (error.name === 'AbortError') { }
2. Use AbortController for cancellation:
   const controller = new AbortController()
3. Add timeouts: AbortSignal.timeout(5000)
    `.trim()
  },

  {
    name: "PROCESS_ERROR",
    match: /child process|spawn|fork.*error|ERR_CHILD_PROCESS/i,
    explain: (error) => `
Error spawning or managing a child process.

Common causes:
- Command not found
- Permission denied to execute
- Invalid arguments

Solution:
1. Check command exists and is executable
2. Use full path: '/usr/bin/node' not just 'node'
3. Handle child process errors:
   child.on('error', (err) => { })
4. Check exit code: process.exitCode
    `.trim()
  },

  {
    name: "ASSERTION_ERROR",
    match: /AssertionError|Assert.*failed|assertion.*false/i,
    explain: (error) => `
An assertion failed - a condition you asserted was false when it should be true.

Common causes:
- Unit test failed
- Debug assertion triggered
- Unexpected state

Solution:
1. Check the assertion message for details
2. Fix the code or test
3. Use assertions for debugging: assert(condition, 'message')
4. Better: console.assert(condition, 'message')
    `.trim()
  },

  {
    name: "DEPRECATED_API",
    match: /DeprecationWarning|deprecated|Deprecation/i,
    explain: (error) => `
You're using an API or feature that's deprecated and will be removed.

Common causes:
- Using old Node.js API
- Old library version
- Feature marked for removal

Solution:
1. Check deprecation message for replacement
2. Update to newer API
3. Suppress warning if necessary (not recommended):
   --no-deprecation flag
4. Keep code updated with Node.js releases
    `.trim()
  },

  {
    name: "UNSAFE_INTEGER",
    match: /unsafe integer|MAX_SAFE_INTEGER|Not a safe integer/i,
    explain: (error) => `
Number exceeds JavaScript's safe integer range (±2^53).

Common causes:
- Very large numbers (BigInt needed)
- Calculations overflow
- Precision loss

Solution:
1. Use BigInt for large numbers: 123n
2. Use BigInt operations: 1n + 1n
3. Convert carefully: BigInt(number)
4. Handle in calculations: Math.floor() before using
    `.trim()
  },

  {
    name: "TEMPLATE_LITERAL_ERROR",
    match: /template|string.*template|backtick/i,
    explain: (error) => `
Error with template literals or string formatting.

Common causes:
- Missing backticks: \` instead of '
- Unescaped $ in template
- Invalid expression in \${}

Solution:
1. Use backticks for template literals: \`text \${var}\`
2. Escape literal $: \\$ if needed
3. Use valid expressions in \${}: \${variable}, \${1 + 1}
    `.trim()
  },

  {
    name: "ARRAY_OUT_OF_BOUNDS",
    match: /out of range|index out of bounds|RangeError|length/i,
    explain: (error) => `
Array index is out of valid range or operation exceeds array bounds.

Common causes:
- Negative index without check
- Index equals or exceeds length
- Wrong loop condition

Solution:
1. Check array length: if (index < arr.length)
2. Use proper loop: for (let i = 0; i < arr.length; i++)
3. Use array methods: arr.forEach(), map(), filter()
4. Handle edge cases
    `.trim()
  },

  {
    name: "DIVISION_BY_ZERO",
    match: /division.*zero|divide.*zero|Infinity|toDo by zero/i,
    explain: (error) => `
Division by zero encountered - mathematically undefined.

Common causes:
- Denominator is 0 or evaluates to 0
- Missing validation

Solution:
1. Check denominator isn't zero: if (divisor !== 0)
2. Provide fallback value: divisor || 1
3. Handle Infinity gracefully: if (!isFinite(result))
4. Validate inputs before operations
    `.trim()
  },

  {
    name: "MIXED_CONTENT",
    match: /mixed content|https.*http|insecure content/i,
    explain: (error) => `
HTTPS page is trying to load HTTP content - browser blocks this for security.

Common causes:
- HTTPS page loading HTTP resource
- Image, script, or API from HTTP

Solution:
1. Use HTTPS for all resources
2. Update all URLs to https://
3. Use protocol-relative URLs: //example.com/image.jpg
4. Update API endpoints to use HTTPS
    `.trim()
  },

  {
    name: "ENCODING_MISMATCH",
    match: /encoding|charset|UTF-8|BOM|byte order/i,
    explain: (error) => `
Character encoding mismatch - data in one encoding, expected another.

Common causes:
- File saved in different encoding than expected
- BOM (Byte Order Mark) interference
- Locale encoding mismatch

Solution:
1. Save files as UTF-8 consistently
2. Specify encoding: fs.readFileSync(path, 'utf8')
3. Check for BOM: if (content.charCodeAt(0) === 0xFEFF)
4. Use consistent encoding across project
    `.trim()
  },

  {
    name: "LOCK_FILE_ERROR",
    match: /lock|ELOCKED|in use by another|lockfile/i,
    explain: (error) => `
Resource is locked - being used by another process.

Common causes:
- File/database in use
- Another npm install running
- Process hasn't closed properly

Solution:
1. Close other processes using resource
2. Delete lock files: rm -f package-lock.json
3. Wait for process to release lock
4. Use proper locking: npm-lock package
    `.trim()
  },

  // NPM and Package Management Errors
  {
    name: "NPM_ERR_PEER_DEP_MISSING",
    match: /peer dep.*missing|unmet peer|WARN compat.*peer/i,
    explain: (error) => `
A peer dependency is missing but required by a package.

Common causes:
- Package version mismatch
- Peer dependency not installed
- Version incompatibility

Solution:
1. Install missing peer dependency: npm install <package>
2. Check package.json for correct versions
3. Use npm ls to see dependency tree
4. Update packages: npm update
    `.trim()
  },

  {
    name: "NPM_AUDIT_VULNERABILITY",
    match: /npm audit|vulnerability|security|high severity|critical/i,
    explain: (error) => `
Security vulnerability found in dependencies.

Common causes:
- Outdated package with known vulnerability
- Transitive dependency has security issue
- Using unpatched version

Solution:
1. Run: npm audit to see details
2. Update packages: npm audit fix
3. Check advisory details online
4. Pin safe versions in package.json
5. Keep dependencies up to date
    `.trim()
  },

  {
    name: "NPM_INSTALL_FAILED",
    match: /npm ERR|install failed|cannot compile|build failed/i,
    explain: (error) => `
Package installation failed - typically due to native dependency or build.

Common causes:
- C++ compiler not available
- Python not installed
- Missing build tools
- Node version mismatch

Solution:
1. On Mac: xcode-select --install
2. On Windows: npm install --global windows-build-tools
3. On Linux: sudo apt-get install build-essential
4. Check Node version: node --version
5. Try: npm install --ignore-scripts
    `.trim()
  },

  {
    name: "NPM_SHRINKWRAP_CONFLICT",
    match: /shrinkwrap|npm-shrinkwrap|package-lock.*conflict/i,
    explain: (error) => `
Conflict between npm-shrinkwrap.json and package-lock.json.

Common causes:
- Both lockfiles present
- Lockfile corruption
- Git merge conflict

Solution:
1. Delete one: rm package-lock.json (if npm-shrinkwrap exists)
2. Reinstall: npm install
3. Use consistent lockfile strategy
4. Don't commit both lockfiles
    `.trim()
  },

  {
    name: "INVALID_PACKAGE_NAME",
    match: /Invalid package name|package name.*invalid|ERR.*name/i,
    explain: (error) => `
Package name doesn't meet npm naming requirements.

Common causes:
- Name contains uppercase letters
- Name starts with dot or underscore
- Name has special characters
- Name too long

Solution:
1. Use lowercase: name must be lowercase
2. No dots or underscores at start
3. Only alphanumeric, hyphens allowed
4. Keep under 214 characters
5. Check npm package naming rules
    `.trim()
  },

  // TypeScript Errors
  {
    name: "TS_COMPILATION_ERROR",
    match: /TypeScript|\.ts.*error|TS\d+|tsc/i,
    explain: (error) => `
TypeScript compilation error - type checking failed.

Common causes:
- Type mismatch
- Missing type definitions
- Incompatible types
- Type inference failed

Solution:
1. Check error code: TS2345, TS2304, etc.
2. Install type definitions: npm install --save-dev @types/package
3. Use type annotations correctly
4. Check tsconfig.json settings
5. Use 'any' type as temporary fix (not recommended)
    `.trim()
  },

  {
    name: "TS_CANNOT_FIND_NAME",
    match: /Cannot find name|TS2304|not defined/i,
    explain: (error) => `
TypeScript can't find a variable, function, or type name.

Common causes:
- Type definitions not installed
- Variable not imported
- Typo in name
- Wrong scope

Solution:
1. Install types: npm install --save-dev @types/package-name
2. Import the variable/function
3. Check spelling
4. Verify variable is in scope
5. Use: declare let variable: any (as workaround)
    `.trim()
  },

  {
    name: "TS_PROPERTY_DOES_NOT_EXIST",
    match: /has no property|TS2339|Property.*does not exist/i,
    explain: (error) => `
Trying to access property that doesn't exist in type.

Common causes:
- Property name typo
- Property not in type definition
- Using wrong object
- Version mismatch of types

Solution:
1. Check property spelling
2. Verify type definition includes property
3. Use type assertion: (obj as any).property
4. Update type definitions
5. Check documentation for correct property name
    `.trim()
  },

  {
    name: "TS_ARGUMENT_MISMATCH",
    match: /Argument of type|TS2345|not assignable/i,
    explain: (error) => `
Function argument type doesn't match expected type.

Common causes:
- Wrong type passed
- Incompatible types
- Missing optional property
- Extra properties not allowed

Solution:
1. Check expected type in function signature
2. Cast to correct type: myFunc(x as ExpectedType)
3. Convert type: String(value) or parseInt()
4. Use type assertion in function call
5. Check library documentation for correct types
    `.trim()
  },

  // Promise and Async Errors
  {
    name: "ASYNC_ITERATOR_ERROR",
    match: /async iterator|for await|Symbol\.asyncIterator/i,
    explain: (error) => `
Error with async iterators or for-await loops.

Common causes:
- Object doesn't implement async iterator
- Using for-await on non-async iterable
- Invalid async generator

Solution:
1. Implement Symbol.asyncIterator
2. Use proper async generator: async function*
3. Use for-await only with async iterables
4. Convert to Promise if needed
    `.trim()
  },

  {
    name: "PROMISE_CONSTRUCTOR_EXECUTOR_ERROR",
    match: /Promise executor|executor threw/i,
    explain: (error) => `
Error thrown in Promise constructor executor function.

Common causes:
- Synchronous error in executor
- resolve/reject called twice
- Executor throws exception

Solution:
1. Wrap executor in try/catch
2. Call resolve/reject only once
3. Ensure executor returns sync operation
4. Use: new Promise((resolve, reject) => { })
    `.trim()
  },

  {
    name: "CANNOT_USE_AWAIT_OUTSIDE_ASYNC",
    match: /await.*outside|not in async|TS1308|Unexpected.*await/i,
    explain: (error) => `
Using await outside async function context.

Common causes:
- await in non-async function
- Top-level await without module type
- Missing async keyword

Solution:
1. Add async: async function myFunc() { await ... }
2. For top-level await, set in tsconfig or package.json
3. Use .then() instead of await if can't use async
4. Wrap in async IIFE: (async () => { await ... })()
    `.trim()
  },

  // Database Errors
  {
    name: "POSTGRES_CONNECTION_ERROR",
    match: /postgres|postgresql|ECONNREFUSED.*5432|pg error/i,
    explain: (error) => `
Cannot connect to PostgreSQL database.

Common causes:
- PostgreSQL server not running
- Wrong host/port/credentials
- Firewall blocking connection
- Connection pool exhausted

Solution:
1. Verify PostgreSQL running: brew services list
2. Check connection string in env
3. Default port is 5432
4. Verify user/password correct
5. Check firewall rules if remote
    `.trim()
  },

  {
    name: "REDIS_CONNECTION_ERROR",
    match: /redis|ECONNREFUSED.*6379|redis error|ERR unknown command/i,
    explain: (error) => `
Cannot connect to or communicate with Redis.

Common causes:
- Redis server not running
- Wrong host/port
- Redis command syntax error
- Version incompatibility

Solution:
1. Start Redis: redis-server
2. Check port 6379 is listening
3. Verify Redis CLI works: redis-cli
4. Check command syntax in docs
5. Clear cache if corrupted: FLUSHALL
    `.trim()
  },

  {
    name: "MYSQL_CONNECTION_ERROR",
    match: /mysql|PROTOCOL_CONNECTION_LOST|PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR/i,
    explain: (error) => `
MySQL connection failed or lost.

Common causes:
- MySQL server not running
- Wrong host/port/user/password
- Connection timeout
- Too many connections

Solution:
1. Start MySQL: brew services start mysql
2. Check user/password in config
3. Use connection pool: maxConnections: 10
4. Add timeout: connectionTimeoutMillis: 5000
5. Check MySQL is accessible
    `.trim()
  },

  {
    name: "DYNAMODB_ERROR",
    match: /DynamoDB|ResourceNotFoundException|ValidationException|AWS|dynamodb/i,
    explain: (error) => `
AWS DynamoDB operation failed.

Common causes:
- Table doesn't exist
- Invalid key/attribute
- Wrong AWS credentials
- Rate limiting

Solution:
1. Verify table exists
2. Check primary key format
3. Verify AWS credentials configured
4. Check IAM permissions
5. Add exponential backoff for throttling
    `.trim()
  },

  // Regex Errors
  {
    name: "REGEX_SYNTAX_ERROR",
    match: /Invalid regular expression|regex.*error|regex.*invalid|unterminated/i,
    explain: (error) => `
Invalid regular expression pattern.

Common causes:
- Unescaped special characters
- Unclosed bracket or group
- Invalid range in character class
- Backslash not escaped

Solution:
1. Escape special chars: \\(, \\), \\[, \\], \\.
2. Check all brackets balanced
3. Use regex validator: regexr.com
4. Escape backslashes: \\\\ in string literals
5. Test regex before use
    `.trim()
  },

  {
    name: "REGEX_CATASTROPHIC_BACKTRACKING",
    match: /backtrack|catastrophic|hangs|freezes|regex.*slow/i,
    explain: (error) => `
Regex pattern causes catastrophic backtracking - very slow.

Common causes:
- Overlapping quantifiers: (a+)+
- Complex nested quantifiers
- Alternation with overlap: a|ab

Solution:
1. Simplify regex pattern
2. Avoid nested quantifiers
3. Use atomic grouping: (?>...)
4. Be specific with character classes
5. Test performance: test on large strings
    `.trim()
  },

  // Security Errors
  {
    name: "SQL_INJECTION_WARNING",
    match: /SQL injection|sql.*dangerous|unsafe sql|concatenat.*query/i,
    explain: (error) => `
SQL injection vulnerability detected - using unsanitized user input in SQL.

Common causes:
- Concatenating user input into SQL
- Not using parameterized queries
- Trusting user input

Solution:
1. Use parameterized queries: db.query('SELECT * FROM users WHERE id = ?', [id])
2. Use ORM: Sequelize, Knex, TypeORM
3. Validate and sanitize input
4. Use prepared statements
5. Never concatenate user input
    `.trim()
  },

  {
    name: "XSS_VULNERABILITY",
    match: /XSS|cross.?site.*scripting|innerHTML|dangerouslySetInnerHTML/i,
    explain: (error) => `
Cross-site scripting (XSS) vulnerability - unsanitized HTML injection risk.

Common causes:
- Setting innerHTML with user input
- Not escaping user data
- Using dangerouslySetInnerHTML
- Reflected XSS in URL

Solution:
1. Use textContent instead of innerHTML
2. Escape HTML: use DOMPurify or similar
3. Use templating safely
4. Content Security Policy headers
5. Validate and sanitize all inputs
    `.trim()
  },

  {
    name: "SENSITIVE_DATA_EXPOSURE",
    match: /password|api.?key|secret|token.*log|hardcoded|credentials/i,
    explain: (error) => `
Sensitive data exposed in logs or code.

Common causes:
- Passwords/keys in source code
- Logging sensitive data
- Committing .env files
- Hardcoded credentials

Solution:
1. Use environment variables
2. Add .env to .gitignore
3. Use dotenv package
4. Don't log passwords/tokens
5. Use secrets management (AWS Secrets, Vault)
    `.trim()
  },

  // Express/Web Framework Errors
  {
    name: "EXPRESS_MIDDLEWARE_ERROR",
    match: /middleware|app\.use|Express.*middleware|next.*not.*called/i,
    explain: (error) => `
Express middleware error - typically not calling next().

Common causes:
- Forgot to call next() in middleware
- next() called multiple times
- Error in middleware execution
- Middleware not registered

Solution:
1. Call next() to continue chain: next()
2. Or send response: res.send()
3. Add error handling: (err, req, res, next) => {}
4. Register middleware early: app.use(middleware)
5. Order matters - put error handlers last
    `.trim()
  },

  {
    name: "NEXT_JS_HYDRATION_ERROR",
    match: /hydration|hydratation.*mismatch|useEffect|window.*undefined/i,
    explain: (error) => `
Next.js hydration mismatch - server and client render different HTML.

Common causes:
- Using window object in render (no SSR)
- Date/random values differ between renders
- Conditional rendering based on client state
- CSS-in-JS not applied on server

Solution:
1. Move window access to useEffect
2. Use dynamic imports: dynamic(() => import(...), { ssr: false })
3. Generate same value on server and client
4. Use Date/Math.random consistently
5. Ensure CSS is applied on both server and client
    `.trim()
  },

  {
    name: "NEST_JS_DEPENDENCY_ERROR",
    match: /NestJS|Cannot resolve dependency|Nest.*error|@Injectable/i,
    explain: (error) => `
NestJS dependency injection failed - can't resolve a dependency.

Common causes:
- Service not provided
- Circular dependency
- Service not decorated with @Injectable()
- Wrong module import

Solution:
1. Add @Injectable() decorator to service
2. Provide in module: providers: [MyService]
3. Import module in imports: []
4. Check for circular dependencies
5. Use forwardRef() if circular: forwardRef(() => MyService)
    `.trim()
  },

  // Encoding Errors
  {
    name: "ICONV_ENCODING_ERROR",
    match: /iconv|encoding.*fail|decode.*error|encode.*error/i,
    explain: (error) => `
Character encoding conversion failed.

Common causes:
- Unsupported encoding
- Corrupted encoded data
- Encoding mismatch

Solution:
1. Use correct encoding name
2. Validate encoding before conversion
3. Use try/catch for encoding operations
4. Use Buffer for binary data
5. Check data integrity
    `.trim()
  },

  {
    name: "UTF8_SURROGATE_ERROR",
    match: /surrogate|UTF-16.*surrogate|encoded.*invalid/i,
    explain: (error) => `
Invalid UTF-8 surrogate pair in text encoding.

Common causes:
- Mixing UTF-8 and UTF-16
- Invalid surrogate handling
- Corrupt file encoding

Solution:
1. Validate UTF-8 data
2. Use Buffer.toString('utf8')
3. Check file encoding in editor
4. Convert consistently: iconv-lite
5. Handle invalid sequences: replace with replacement char
    `.trim()
  },

  // Performance Errors
  {
    name: "PERFORMANCE_MEMORY_WARNING",
    match: /memory usage|heap|garbage collection|V8|memory pressure/i,
    explain: (error) => `
Memory usage warning - application using too much heap.

Common causes:
- Memory leak accumulating
- Large objects not released
- Too many event listeners
- Cache growing unbounded

Solution:
1. Profile memory: node --inspect app.js
2. Check for event listener leaks
3. Implement cache size limits
4. Use WeakMap/WeakSet for object references
5. Monitor with process.memoryUsage()
    `.trim()
  },

  {
    name: "SLOW_QUERY_WARNING",
    match: /slow query|query.*slow|milliseconds.*exceeded|threshold/i,
    explain: (error) => `
Database query is slow and exceeds threshold.

Common causes:
- Missing database index
- Full table scan
- Complex JOIN
- Large result set

Solution:
1. Add database index on queried columns
2. Use EXPLAIN to analyze query
3. Limit result set: LIMIT, OFFSET
4. Use better queries, avoid N+1
5. Consider caching frequently accessed data
    `.trim()
  },

  {
    name: "EVENT_EMITTER_MEMORY_LEAK",
    match: /EventEmitter|memory leak|listener.*leak|removeListener|maxListeners/i,
    explain: (error) => `
Event emitter accumulating listeners causing memory leak.

Common causes:
- Not removing event listeners
- Listeners added repeatedly
- Circular references in listeners

Solution:
1. Remove listeners: emitter.removeListener('event', handler)
2. Use once instead of on: emitter.once('event', handler)
3. Increase if needed: emitter.setMaxListeners(100)
4. Check for circular references
5. Use .removeAllListeners() carefully
    `.trim()
  },

  // Stream Errors
  {
    name: "STREAM_BACKPRESSURE_ERROR",
    match: /stream.*backpressure|pipe.*drain|writable.*end|high water mark/i,
    explain: (error) => `
Stream backpressure not handled - writing faster than reading.

Common causes:
- Not checking write return value
- Not listening to drain event
- Writing to slow stream too fast

Solution:
1. Check write() return value
2. Listen to drain event: stream.on('drain', ...)
3. Pause reading: readable.pause()
4. Use pipe(): readStream.pipe(writeStream)
5. Respect high water mark
    `.trim()
  },

  {
    name: "STREAM_ENCODING_ERROR",
    match: /stream.*encoding|setEncoding|encoding.*stream/i,
    explain: (error) => `
Stream encoding configuration error.

Common causes:
- Invalid encoding name
- setEncoding called after data event
- Encoding mismatch

Solution:
1. Call setEncoding before reading: stream.setEncoding('utf8')
2. Use valid encoding names
3. Avoid setEncoding with binary data
4. Handle encoding consistently
    `.trim()
  },

  // OS and System Errors
  {
    name: "ESRCH_PROCESS_NOT_FOUND",
    match: /ESRCH|no such process|process.*not.*found/i,
    explain: (error) => `
Process specified doesn't exist or has already exited.

Common causes:
- Process ID no longer valid
- Process exited
- Trying to kill non-existent process

Solution:
1. Check process exists before operation
2. Try/catch around process operations
3. Use process manager: PM2, Forever
4. Check PID validity
    `.trim()
  },

  {
    name: "EAGAIN_TRY_AGAIN",
    match: /EAGAIN|try again|temporarily unavailable|resource temporarily/i,
    explain: (error) => `
Operation temporarily unavailable - try again later.

Common causes:
- System resource temporarily unavailable
- Rate limited
- Resource contention

Solution:
1. Implement retry with exponential backoff
2. Wait and try again: setTimeout(() => retry(), 100)
3. Check system resources
4. Reduce concurrent operations
    `.trim()
  },

  // File System Advanced Errors
  {
    name: "FILE_DESCRIPTOR_LIMIT",
    match: /EMFILE|too many open files|ulimit/i,
    explain: (error) => `
Hit system limit for open file descriptors.

Common causes:
- Too many files open simultaneously
- File handles not closed
- Process needs more file descriptors

Solution:
1. Close files after use: stream.end()
2. Increase limit: ulimit -n 4096 (Mac/Linux)
3. Use connection pooling
4. Implement file descriptor management
5. Monitor: lsof -p PID
    `.trim()
  },

  {
    name: "SYMBOLIC_LINK_ERROR",
    match: /symbolic link|symlink|ELOOP|too many.*link|circular.*link/i,
    explain: (error) => `
Error with symbolic links - circular reference or too many levels.

Common causes:
- Circular symbolic link
- Too many symlink levels
- Following symlink not allowed

Solution:
1. Check for circular references
2. Limit symlink following depth
3. Use realpath to resolve: fs.realpathSync()
4. Avoid symlinks across boundaries
5. Break circular references
    `.trim()
  },

  {
    name: "FILE_ALREADY_IN_USE",
    match: /EBUSY|file.*in use|already.*use|busy|open by another/i,
    explain: (error) => `
File is currently in use by another process.

Common causes:
- File locked by another process
- Still being written by editor
- Haven't closed handle properly

Solution:
1. Close file handles explicitly
2. Wait before accessing: setTimeout(..., 100)
3. Use file locking library
4. Close editor if editing file
5. Use exclusive locks when needed
    `.trim()
  },

  // Buffer Errors
  {
    name: "BUFFER_OUT_OF_BOUNDS",
    match: /Buffer.*out of bounds|offset.*out|Buffer overflow|offset is out/i,
    explain: (error) => `
Buffer operation attempted outside valid range.

Common causes:
- Offset exceeds buffer length
- Write beyond buffer size
- Invalid buffer size

Solution:
1. Check offset < buffer.length
2. Allocate sufficient buffer size
3. Use: Buffer.alloc(size) for safe allocation
4. Validate offset before operations
5. Use Buffer.allocUnsafe() carefully
    `.trim()
  },

  {
    name: "BUFFER_ENCODING_WRITE_ERROR",
    match: /write.*encoding|encoding.*write|invalid.*encoding.*buffer/i,
    explain: (error) => `
Buffer write failed due to encoding issue.

Common causes:
- Invalid encoding for write
- Data not compatible with encoding
- Offset calculation error

Solution:
1. Use valid encoding: utf8, base64, hex, ascii
2. Ensure data matches encoding
3. Calculate offset correctly
4. Use Buffer.from() with encoding parameter
5. Verify data format
    `.trim()
  },

  // Crypto Errors
  {
    name: "CRYPTO_ALGORITHM_ERROR",
    match: /crypto|cipher.*unknown|algorithm.*unknown|invalid.*algorithm/i,
    explain: (error) => `
Invalid or unsupported cryptographic algorithm.

Common causes:
- Unknown cipher name
- Algorithm not available
- Wrong algorithm name

Solution:
1. Use supported algorithms: crypto.getCiphers()
2. Common: aes-256-cbc, sha256
3. Check Node.js crypto support
4. Use correct algorithm names
5. Update Node.js if algorithm missing
    `.trim()
  },

  {
    name: "CRYPTO_KEY_ERROR",
    match: /key.*invalid|key.*error|EVP_.*error|private key|public key/i,
    explain: (error) => `
Cryptographic key is invalid or incorrectly formatted.

Common causes:
- Key wrong length
- Key wrong format
- Corrupted key
- Wrong key type

Solution:
1. Verify key length matches algorithm
2. Ensure PEM format if using files
3. Check key generation: crypto.generateKeyPairSync()
4. Validate key format before use
5. Use crypto libraries: node-rsa, libsodium
    `.trim()
  },

  // Cluster Errors
  {
    name: "CLUSTER_FORK_ERROR",
    match: /cluster|fork.*failed|worker.*failed|clusters/i,
    explain: (error) => `
Node.js cluster worker failed to fork or initialize.

Common causes:
- Resource limit exceeded
- Worker code has error
- Memory insufficient

Solution:
1. Check ulimit for process limits
2. Validate worker code runs standalone
3. Handle worker crashes: cluster.on('exit')
4. Add graceful shutdown
5. Use process manager: PM2, systemd
    `.trim()
  },

  // Worker Threads Errors
  {
    name: "WORKER_THREAD_ERROR",
    match: /Worker|worker.*thread|ERR_WORKER_INVALID_EXEC_ARGV/i,
    explain: (error) => `
Error in worker thread creation or execution.

Common causes:
- Worker file has syntax error
- Invalid worker options
- Resource limit hit

Solution:
1. Ensure worker file runs standalone
2. Use correct API: new Worker(filename)
3. Handle worker errors: worker.on('error')
4. Properly initialize worker
5. Clean up workers: worker.terminate()
    `.trim()
  },

  // Crypto Key Pair Errors
  {
    name: "RSA_KEY_GENERATION_ERROR",
    match: /RSA|key pair|generation.*error|bits.*invalid/i,
    explain: (error) => `
RSA key pair generation failed.

Common causes:
- Invalid bit size (too small)
- System resource unavailable
- Invalid options

Solution:
1. Use supported key sizes: 2048, 4096
2. Increase timeout for generation
3. Check system has enough entropy
4. Use async generation: generateKeyPair()
5. Verify options object format
    `.trim()
  },

  // HTTP2 Errors
  {
    name: "HTTP2_ERROR",
    match: /HTTP\/2|http2|ERR_HTTP2.*|h2 error/i,
    explain: (error) => `
HTTP/2 protocol error.

Common causes:
- HTTP/2 not fully supported
- Stream issues
- Connection error

Solution:
1. Ensure Node.js version supports HTTP/2
2. Check HTTP/2 enabled
3. Handle stream errors: stream.on('error')
4. Verify TLS certificate for HTTP/2
5. Check server configuration
    `.trim()
  },

  // DNS Errors
  {
    name: "DNS_LOOKUP_ERROR",
    match: /DNS|ENOTFOUND|getaddrinfo|ENETUNREACH|EHOSTUNREACH/i,
    explain: (error) => `
DNS lookup failed - cannot resolve hostname.

Common causes:
- Hostname doesn't exist
- Network unreachable
- DNS server unavailable
- Wrong hostname

Solution:
1. Check hostname spelling
2. Verify DNS is working: nslookup
3. Add error handling: dns.lookup(...)
4. Use fallback DNS: 8.8.8.8
5. Check network connectivity
    `.trim()
  },

  // Child Process Errors
  {
    name: "CHILD_PROCESS_TIMEOUT",
    match: /child.*timeout|spawn.*error|exec.*timeout|timeout.*process/i,
    explain: (error) => `
Child process operation timed out.

Common causes:
- Process taking too long
- Timeout value too short
- Process hanging/deadlock

Solution:
1. Increase timeout: { timeout: 30000 }
2. Implement timeout: setTimeout(..., timeout)
3. Kill after timeout: child.kill('SIGTERM')
4. Debug process: check what it's doing
5. Use '--timeout' flag if needed
    `.trim()
  },

  // Array/Object Errors
  {
    name: "SPREAD_OPERATOR_ERROR",
    match: /spread|\.\.\.|\.\.\.|spread.*iterable|not iterable/i,
    explain: (error) => `
Spread operator error - trying to spread non-iterable.

Common causes:
- Spreading null/undefined
- Spreading non-iterable object
- Using spread on wrong type

Solution:
1. Check value is iterable before spread
2. Convert to array: Array.from(obj)
3. Use optional: ...obj || []
4. Verify object is iterable
5. Use for-of if not spreadable
    `.trim()
  },

  {
    name: "DESTRUCTURING_ERROR",
    match: /destructuring|destructur.*error|cannot destructure|destructure.*null/i,
    explain: (error) => `
Object/array destructuring failed.

Common causes:
- Destructuring null/undefined
- Property doesn't exist
- Wrong destructuring syntax

Solution:
1. Add null checks: const { prop } = obj || {}
2. Use default values: const { prop = default } = obj
3. Verify property exists
4. Check destructuring syntax
5. Use optional chaining: obj?.prop
    `.trim()
  },

  // WeakMap/WeakSet Errors
  {
    name: "WEAKMAP_ERROR",
    match: /WeakMap|WeakSet|weak.*map|weak.*set|Invalid.*value/i,
    explain: (error) => `
WeakMap or WeakSet operation error.

Common causes:
- Using non-object as key in WeakMap
- Using primitives instead of objects
- Incorrect WeakMap/WeakSet usage

Solution:
1. Only use objects as WeakMap keys
2. Don't use primitives: use Map for those
3. Check value type before adding
4. Use Map for primitives: new Map()
5. WeakMap keys must be objects
    `.trim()
  },

  // Proxy Errors
  {
    name: "PROXY_ERROR",
    match: /Proxy|trap.*invalid|proxy.*invalid|invariant violation/i,
    explain: (error) => `
Proxy trap or Proxy invariant validation failed.

Common causes:
- Trap returning invalid value
- Trap not respecting invariants
- Proxy configuration error

Solution:
1. Check trap returns correct type
2. Respect proxy invariants
3. Return from get trap: return value
4. Validate trap implementation
5. Use Proxy carefully - test thoroughly
    `.trim()
  },

  // Generator Errors
  {
    name: "GENERATOR_ERROR",
    match: /generator|function\*|yield|next\(\)|generator.*ended/i,
    explain: (error) => `
Error in generator function or generator iteration.

Common causes:
- Calling next() after done
- Invalid yield statement
- Not properly initializing generator

Solution:
1. Check { done } flag before using value
2. Use for-of for generators: for (const val of gen)
3. Properly create generator: const gen = genFunc()
4. Handle StopIteration properly
5. Verify generator function syntax: function*
    `.trim()
  },

  // JSON Schema Errors
  {
    name: "JSON_SCHEMA_VALIDATION_ERROR",
    match: /schema|validation.*failed|schema.*error|ajv|not valid/i,
    explain: (error) => `
JSON schema validation failed.

Common causes:
- Data doesn't match schema
- Required field missing
- Type mismatch with schema
- Pattern validation failed

Solution:
1. Check error.dataPath for which property
2. Verify all required fields present
3. Check data types match schema
4. Review schema definition
5. Use schema validator: ajv, joi
    `.trim()
  },

  // Certificate Chain Errors
  {
    name: "CERTIFICATE_CHAIN_ERROR",
    match: /certificate.*chain|unable to verify.*chain|depth zero|cert.*chain/i,
    explain: (error) => `
SSL certificate chain validation failed.

Common causes:
- Intermediate cert missing
- Self-signed certificate
- Cert expired
- Wrong chain order

Solution:
1. Ensure full chain is provided
2. For self-signed: NODE_TLS_REJECT_UNAUTHORIZED=0 (dev only)
3. Update cert to valid one
4. Check cert isn't expired: openssl x509 -in cert.pem -text
5. Proper order: leaf, intermediate, root
    `.trim()
  },

  // International Domain Names
  {
    name: "IDNA_ERROR",
    match: /IDNA|punycode|domain.*format|internationalized.*domain/i,
    explain: (error) => `
International domain name (IDN) encoding error.

Common causes:
- Invalid Unicode domain name
- Punycode conversion failed
- Invalid domain format

Solution:
1. Use proper IDN format
2. Use punycode library: install 'punycode'
3. Encode domain: require('punycode').toASCII(domain)
4. Verify domain format
5. Check URL encoding
    `.trim()
  },

  // Path Traversal Errors
  {
    name: "PATH_TRAVERSAL_ATTEMPT",
    match: /path.*traversal|\.\.\/|directory traversal|path.*escape|sanitize/i,
    explain: (error) => `
Path traversal attack or suspicious path detected.

Common causes:
- Using unsanitized user input in paths
- Not validating file path
- Allowing ../

Solution:
1. Validate paths: path.resolve() and check inside base
2. Use path.join() and validate result
3. Never concatenate user input directly
4. Whitelist allowed paths
5. Use path.normalize() and validate
    `.trim()
  },

  // Date/Time Errors
  {
    name: "DATE_TIMEZONE_ERROR",
    match: /timezone|time.?zone|offset.*invalid|IANA.*timezone/i,
    explain: (error) => `
Date or timezone conversion error.

Common causes:
- Invalid timezone ID
- Timezone not recognized
- Daylight savings issue

Solution:
1. Use IANA timezone names: America/New_York
2. Use moment-timezone or date-fns
3. Avoid manual offset calculations
4. Verify timezone ID exists
5. Account for daylight savings
    `.trim()
  },

  // Atomicity/Transaction Errors
  {
    name: "TRANSACTION_ERROR",
    match: /transaction|commit.*failed|rollback|ACID|isolation/i,
    explain: (error) => `
Database transaction failed or rolled back.

Common causes:
- Constraint violation
- Deadlock detected
- Transaction timeout
- Isolation level conflict

Solution:
1. Check constraint violations
2. Implement retry logic for deadlocks
3. Increase transaction timeout if needed
4. Review isolation levels
5. Use connection pool for concurrency
    `.trim()
  },

  // Compression Errors
  {
    name: "COMPRESSION_ERROR",
    match: /gzip|deflate|brotli|compress.*error|decompress.*error|zlib/i,
    explain: (error) => `
Compression or decompression failed.

Common causes:
- Corrupted compressed data
- Wrong decompression codec
- Incomplete data
- Memory error

Solution:
1. Check data isn't corrupted
2. Use correct decompression: zlib.gunzip()
3. Handle incomplete data
4. Catch errors: stream.on('error')
5. Use compression headers correctly
    `.trim()
  },

  // OpenSSL Errors
  {
    name: "OPENSSL_ERROR",
    match: /OpenSSL|libssl|error in.*library|engine|OPENSSLDIR/i,
    explain: (error) => `
OpenSSL library error - usually cryptographic operation failed.

Common causes:
- OpenSSL not installed
- Version mismatch
- Cryptographic operation error

Solution:
1. Verify OpenSSL installed: openssl version
2. Check Node version uses compatible OpenSSL
3. Rebuild Node if needed
4. Check OpenSSL permissions
5. Update OpenSSL to latest
    `.trim()
  },

  // Memory Safety Errors
  {
    name: "MEMORY_ACCESS_VIOLATION",
    match: /segmentation fault|SIGSEGV|access violation|crash/i,
    explain: (error) => `
Segmentation fault - memory access violation.

Common causes:
- Native module bug
- Buffer overflow
- Use-after-free
- Out of bounds access

Solution:
1. Update native modules
2. Check for vulnerabilities in modules
3. Use bounds checking
4. Avoid direct memory access
5. Use valgrind for debugging (advanced)
    `.trim()
  },

  // WASM Errors
  {
    name: "WASM_ERROR",
    match: /WASM|WebAssembly|wasm.*error|compiled code|table.*element/i,
    explain: (error) => `
WebAssembly execution error.

Common causes:
- Invalid WASM module
- Function not found in WASM
- Memory access error
- Type mismatch

Solution:
1. Validate WASM module format
2. Check exported functions exist
3. Verify memory page size
4. Use WASM debugging tools
5. Check WASM version compatibility
    `.trim()
  },

  // V8 Snapshot Errors
  {
    name: "SNAPSHOT_ERROR",
    match: /snapshot|v8.*snapshot|serialize|binary.*snapshot/i,
    explain: (error) => `
V8 snapshot creation or loading failed.

Common causes:
- Snapshot incompatible with Node version
- Snapshot corrupted
- Invalid snapshot format

Solution:
1. Regenerate snapshot for current Node version
2. Ensure snapshot is valid binary
3. Check snapshot compatibility
4. Use snapshot feature correctly
5. Clean snapshots and rebuild
    `.trim()
  },

  // Intl Errors
  {
    name: "INTL_ERROR",
    match: /Intl|internationalization|locale|collation|intl.*error/i,
    explain: (error) => `
Internationalization (Intl) API error.

Common causes:
- Invalid locale code
- Feature not supported
- Unsupported operation

Solution:
1. Use valid locale: en-US, fr-FR
2. Check platform Intl support
3. Use Intl.DateTimeFormat, Intl.NumberFormat
4. Handle unsupported locales
5. Fallback to default locale
    `.trim()
  },

  // Express.js Specific Errors
  {
    name: "EXPRESS_INVALID_STATUS_CODE",
    match: /invalid status code|status.*not.*number|ERR_HTTP_INVALID_STATUS_CODE/i,
    explain: (error) => `
Express status code is invalid - must be a number between 100-599.

Common causes:
- Non-numeric status code
- Status code out of range
- res.status() called with string

Solution:
1. Use valid HTTP codes: 200, 404, 500, etc.
2. Ensure status is number: res.status(200)
3. Check valid range: 100-599
4. Don't pass string: res.status('200') ❌ res.status(200) ✓
    `.trim()
  },

  {
    name: "EXPRESS_RESPONSE_ALREADY_SENT",
    match: /response already.*sent|Cannot.*headers after sent|res\.send.*twice/i,
    explain: (error) => `
Trying to send response twice or set headers after response started.

Common causes:
- res.send() called multiple times
- res.json() then res.send()
- Setting headers after res.write()
- Missing return statement

Solution:
1. Use return: return res.send(data)
2. Use if/else, not multiple sends
3. Set headers before writing: res.set('X-Header', val)
4. Structure: headers → write → end
    `.trim()
  },

  {
    name: "EXPRESS_ROUTE_NOT_FOUND",
    match: /Cannot GET|Cannot POST|Cannot PUT|Cannot DELETE|Cannot PATCH|404.*not found/i,
    explain: (error) => `
Express route handler not found - no matching route defined.

Common causes:
- Route path doesn't exist
- Wrong HTTP method (GET vs POST)
- Route path typo
- Route registered after error middleware

Solution:
1. Verify route exists: app.get('/path', ...)
2. Check HTTP method matches request
3. Use app.all('*') for catch-all 404
4. Place 404 handler last in middleware chain
5. Check route path spelling
    `.trim()
  },

  {
    name: "EXPRESS_MIDDLEWARE_NOT_CALLED_NEXT",
    match: /middleware.*next|hanging request|request.*timeout.*middleware|next.*not.*called/i,
    explain: (error) => `
Middleware didn't call next() and didn't send response.

Common causes:
- Forgot to call next() in middleware
- Forgot to send response (res.send)
- Middleware code throwing error
- Async middleware promise not awaited

Solution:
1. Call next() to pass to next middleware
2. OR send response: res.send() or res.json()
3. Async middleware: make handler async and use try/catch
4. Use: app.use((req, res, next) => { next() })
    `.trim()
  },

  {
    name: "EXPRESS_INVALID_MIDDLEWARE",
    match: /middleware.*not.*function|middleware.*must.*function|app\.use.*function/i,
    explain: (error) => `
Middleware is not a function - must be a valid function.

Common causes:
- Passing non-function to app.use()
- Middleware incorrectly defined
- Import error returning undefined

Solution:
1. Ensure middleware is function: app.use((req, res, next) => {})
2. Check import: const middleware = require('./middleware')
3. Verify file exports function
4. Check middleware definition syntax
    `.trim()
  },

  {
    name: "EXPRESS_BODY_PARSER_ERROR",
    match: /body.?parser|payload.*too.*large|request.*entity.*too.*large|413/i,
    explain: (error) => `
Request body exceeds size limit set in body parser.

Common causes:
- Request body too large
- Body parser limit too small
- Sending large file without multipart

Solution:
1. Increase limit: express.json({ limit: '50mb' })
2. Use 'large' for big bodies: { limit: '100mb' }
3. Use multipart for files: multer middleware
4. Configure before routes:
   app.use(express.json({ limit: '50mb' }))
    `.trim()
  },

  {
    name: "EXPRESS_INVALID_JSON",
    match: /invalid json|malformed.*json|body.*parser.*json|SyntaxError.*JSON/i,
    explain: (error) => `
Request body contains invalid JSON.

Common causes:
- Client sends malformed JSON
- Missing quotes on strings
- Trailing comma
- Invalid escape sequences

Solution:
1. Validate JSON on client before sending
2. Add error handler: app.use((err, req, res, next) => {})
3. Log invalid JSON for debugging
4. Return 400 status for invalid JSON
5. Check Content-Type header is application/json
    `.trim()
  },

  {
    name: "EXPRESS_CORS_DISABLED",
    match: /CORS.*not.*enabled|no access.*control.*allow.*origin|can't access|cross.?origin/i,
    explain: (error) => `
CORS headers not sent - cross-origin request blocked.

Common causes:
- CORS not enabled
- Access-Control-Allow-Origin not set
- Requesting from different origin
- Browser enforces CORS policy

Solution:
1. Install cors: npm install cors
2. Use middleware: const cors = require('cors'); app.use(cors())
3. Or configure: app.use(cors({ origin: 'http://localhost:3000' }))
4. For credentials: credentials: true in CORS config
5. Allow specific methods: methods: ['GET', 'POST']
    `.trim()
  },

  {
    name: "EXPRESS_TRUST_PROXY_ERROR",
    match: /trust proxy|X-Forwarded|req\.ip|X-Real-IP|behind.*proxy/i,
    explain: (error) => `
Trust proxy not configured properly - IP address wrong or headers not trusted.

Common causes:
- Behind reverse proxy but trust proxy not set
- Wrong remote address gotten
- Can't access real client IP

Solution:
1. Set trust proxy if behind proxy: app.set('trust proxy', 1)
2. Trust specific proxy: app.set('trust proxy', 'loopback')
3. Get correct IP: req.ip (not req.connection.remoteAddress)
4. Check X-Forwarded-For headers
5. For AWS/Heroku: app.set('trust proxy', true)
    `.trim()
  },

  {
    name: "EXPRESS_RENDER_ERROR",
    match: /render.*not.*function|res\.render|view.*not.*found|template.*error/i,
    explain: (error) => `
View rendering failed - template engine issue.

Common causes:
- View engine not set: app.set('view engine')
- Template file not found
- Template syntax error
- View directory wrong

Solution:
1. Set view engine: app.set('view engine', 'ejs')
2. Set views directory: app.set('views', './views')
3. Ensure template file exists
4. Check template syntax for errors
5. Use: res.render('template', { data })
    `.trim()
  },

  {
    name: "EXPRESS_INVALID_REDIRECT",
    match: /invalid redirect|res\.redirect.*not.*url|redirect.*malformed|location.*header/i,
    explain: (error) => `
Invalid redirect URL provided to res.redirect().

Common causes:
- URL not valid
- Redirect URL has spaces
- Invalid characters in URL

Solution:
1. Use valid URL: res.redirect('/path')
2. Use full URL: res.redirect('http://example.com')
3. Encode URL: encodeURI() if needed
4. Validate URL format before redirect
5. Use 301 for permanent: res.redirect(301, '/path')
    `.trim()
  },

  {
    name: "EXPRESS_CONTENT_TYPE_MISMATCH",
    match: /content.?type|charset|media.*type|accepts/i,
    explain: (error) => `
Content-Type mismatch or incompatible accept header.

Common causes:
- Content-Type header wrong
- Charset encoding mismatch
- Client doesn't accept response format
- res.type() set incorrectly

Solution:
1. Set content-type: res.type('application/json')
2. Use res.json() for JSON (sets correct type)
3. Set charset: res.type('text/html; charset=utf-8')
4. Check client accepts format
5. Use res.set('Content-Type', 'application/json')
    `.trim()
  },

  {
    name: "EXPRESS_COOKIE_ERROR",
    match: /cookie|res\.cookie|Set-Cookie|cookie.*parser|signed.*cookie/i,
    explain: (error) => `
Cookie operation failed - parsing or setting cookie error.

Common causes:
- Cookie size too large
- Invalid cookie name/value
- Cookie middleware not loaded
- Signed cookie key not set

Solution:
1. Use cookie-parser middleware: app.use(cookieParser('secret'))
2. Set cookie: res.cookie('name', 'value')
3. Get cookie: req.cookies.name or req.signedCookies.name
4. Keep cookie size small
5. Use secure/httpOnly for security: { secure: true, httpOnly: true }
    `.trim()
  },

  {
    name: "EXPRESS_SESSION_ERROR",
    match: /session|req\.session|session.*middleware|express.?session/i,
    explain: (error) => `
Session middleware error - configuration or storage issue.

Common causes:
- express-session not installed
- Session store not configured
- Session middleware not loaded
- Session data corrupted

Solution:
1. Install: npm install express-session
2. Configure store (Redis, MongoDB): new RedisStore()
3. Use middleware: app.use(session({ secret: 'key', store: ... }))
4. Load before routes
5. Access: req.session.userId = value
    `.trim()
  },

  {
    name: "EXPRESS_AUTH_HEADER_ERROR",
    match: /authorization|auth.*header|Bearer.*token|unauthorized.*header/i,
    explain: (error) => `
Authorization header missing or malformed.

Common causes:
- No Authorization header sent
- Wrong format: should be "Bearer <token>"
- Token not included
- Bearer prefix missing

Solution:
1. Client sends: Authorization: Bearer <token>
2. Parse in middleware: const token = req.headers.authorization?.split(' ')[1]
3. Verify token exists before using
4. Handle missing auth: return res.status(401).send('Unauthorized')
5. Use passport or jwt middleware for auth
    `.trim()
  },

  {
    name: "EXPRESS_MULTER_ERROR",
    match: /multer|file.*upload|multipart.*form|upload.*error|field.*too.*large/i,
    explain: (error) => `
File upload error - multer middleware issue.

Common causes:
- File size exceeds limit
- Field count exceeds limit
- Wrong field name
- Multer not configured

Solution:
1. Install: npm install multer
2. Configure: const multer = require('multer'); const upload = multer({ dest: 'uploads/' })
3. Use on route: app.post('/upload', upload.single('file'), ...)
4. Access file: req.file
5. Set limits: { fileSize: 1024 * 1024 * 10 } for 10MB
    `.trim()
  },

  {
    name: "EXPRESS_RATE_LIMIT_EXCEEDED",
    match: /rate.*limit|too.*many.*request|429|throttle|limit.*exceeded/i,
    explain: (error) => `
Rate limit exceeded - too many requests.

Common causes:
- Rate limit middleware active
- IP exceeded request quota
- Time window limit reached

Solution:
1. Install: npm install express-rate-limit
2. Create limiter: 
   const limiter = rateLimit({ windowMs: 15*60*1000, max: 100 })
3. Use on routes: app.use(limiter)
4. Implement backoff on client
5. Different limits for different endpoints
    `.trim()
  },

  {
    name: "EXPRESS_HELMET_ERROR",
    match: /helmet|security.*header|X-Frame-Options|CSP|content.*security/i,
    explain: (error) => `
Helmet security middleware blocked request or header issue.

Common causes:
- CSP (Content Security Policy) violated
- Frame embedding not allowed
- Security header misconfigured

Solution:
1. Install: npm install helmet
2. Use: app.use(helmet())
3. Configure CSP: helmet.contentSecurityPolicy({ directives: { ... } })
4. Allow specific sources in CSP
5. Check browser console for CSP violations
    `.trim()
  },

  {
    name: "EXPRESS_COMPRESSION_ENABLED_WRONG",
    match: /compression|compress|gzip|deflate|compression.*error/i,
    explain: (error) => `
Compression middleware issue - response compression error.

Common causes:
- Compression not working
- Already compressed content
- Unsupported encoding
- Wrong middleware order

Solution:
1. Install: npm install compression
2. Use early: app.use(compression())
3. Place before routes
4. Check if response already compressed
5. Set quality: compression({ level: 6 })
    `.trim()
  },

  {
    name: "EXPRESS_MORGAN_LOG_ERROR",
    match: /morgan|logging.*error|morgan.*format|log.*format/i,
    explain: (error) => `
Morgan logging middleware error or misconfiguration.

Common causes:
- Morgan not installed
- Invalid format string
- Wrong middleware order
- Stream error

Solution:
1. Install: npm install morgan
2. Use: app.use(morgan('combined'))
3. Place early in middleware
4. Use format: combined, common, short, tiny
5. Custom: morgan(':method :url :status')
    `.trim()
  },

  {
    name: "EXPRESS_VALIDATOR_ERROR",
    match: /express.?validator|validation.*failed|validationResult|check.*validation/i,
    explain: (error) => `
express-validator validation error or misconfiguration.

Common causes:
- Validators not run
- Validation rules incorrect
- validationResult not checked
- Error not propagated

Solution:
1. Install: npm install express-validator
2. Import: const { body, validationResult } = require('express-validator')
3. Add validators: body('email').isEmail()
4. Check results: const errors = validationResult(req)
5. Return errors: res.status(400).send(errors.array())
    `.trim()
  },

  {
    name: "EXPRESS_PASSPORT_ERROR",
    match: /passport|authentication.*failed|user.*not.*found|auth.*error/i,
    explain: (error) => `
Passport authentication middleware error.

Common causes:
- Strategy not configured
- User not found
- Password incorrect
- Session not set up

Solution:
1. Install: npm install passport passport-local
2. Configure strategy: passport.use(new LocalStrategy(...))
3. Use middleware: app.use(passport.initialize())
4. Serialize user: passport.serializeUser(...)
5. Request authentication: req.login(user, callback)
    `.trim()
  },

  {
    name: "EXPRESS_JSONP_ERROR",
    match: /JSONP|jsonp|callback|padding/i,
    explain: (error) => `
JSONP response error or misconfiguration.

Common causes:
- JSONP not enabled
- Invalid callback parameter
- Wrong response format

Solution:
1. Enable: app.set('jsonp callback name', 'callback')
2. Use res.jsonp(): res.jsonp({ data })
3. Client adds callback: ?callback=myFunc
4. Server wraps: myFunc({data})
5. Validate callback name (security)
    `.trim()
  },

  {
    name: "EXPRESS_STATIC_FILES_ERROR",
    match: /static.*file|send.*file|res\.sendFile|404.*file|Cannot GET.*\.js/i,
    explain: (error) => `
Static file serving error - file not found or access denied.

Common causes:
- File not in static directory
- Wrong path
- Path traversal attempt blocked
- Permission denied

Solution:
1. Serve static files: app.use(express.static('public'))
2. For sendFile: res.sendFile('/path/to/file')
3. Use absolute path: path.join(__dirname, 'public/file')
4. Check file exists before sendFile
5. Security: validate paths, prevent traversal
    `.trim()
  },

  {
    name: "EXPRESS_METHOD_OVERRIDE_ERROR",
    match: /method.?override|_method|X-HTTP-Method-Override|PUT.*not.*allowed/i,
    explain: (error) => `
Method override not working - HTTP method not overridden.

Common causes:
- method-override not installed
- Middleware not loaded
- Wrong override header/param
- PUT/DELETE not intended

Solution:
1. Install: npm install method-override
2. Use: app.use(methodOverride('_method'))
3. Client sends: <input name="_method" value="PUT">
4. Or header: X-HTTP-Method-Override: PUT
5. Place before routes
    `.trim()
  },

  {
    name: "EXPRESS_REQUEST_TIMEOUT",
    match: /request.*timeout|ETIMEDOUT|socket.*timeout|timeout.*request/i,
    explain: (error) => `
Express request timed out - took too long to complete.

Common causes:
- Handler taking too long
- Database query slow
- External API hanging
- No response sent

Solution:
1. Set timeout: server.setTimeout(30000)
2. Implement request timeout middleware
3. Use: const timeout = require('connect-timeout')
4. Add timeout: app.use(timeout('5s'))
5. Optimize slow operations
    `.trim()
  },

  {
    name: "EXPRESS_HANDLEBARS_ERROR",
    match: /handlebars|HBS|template.*error|helper.*not.*found|partial.*error/i,
    explain: (error) => `
Express Handlebars template engine error.

Common causes:
- Template file not found
- Syntax error in template
- Helper not registered
- Partial not found

Solution:
1. Set engine: app.engine('hbs', require('express-handlebars')())
2. Register helper: hbs.registerHelper('name', function(){})
3. Register partial: hbs.registerPartial('name', template)
4. Check template syntax
5. Verify partial exists
    `.trim()
  },

  {
    name: "EXPRESS_EJS_ERROR",
    match: /EJS|ejs.*error|ejs.*undefined|template.*render|ejs.*syntax/i,
    explain: (error) => `
Express EJS template engine error.

Common causes:
- Variable not passed to template
- Template syntax error
- File not found
- Encoding issue

Solution:
1. Set engine: app.set('view engine', 'ejs')
2. Pass data: res.render('template', { variable: value })
3. In template use: <%= variable %>
4. Check EJS syntax
5. Verify variable passed from route
    `.trim()
  },

  {
    name: "EXPRESS_PUG_ERROR",
    match: /Pug|jade|pug.*error|indentation.*error|pug.*syntax/i,
    explain: (error) => `
Express Pug template engine error.

Common causes:
- Indentation error (Pug requires proper indentation)
- Undefined variable
- Syntax error
- File not found

Solution:
1. Set engine: app.set('view engine', 'pug')
2. Check indentation (spaces, not tabs)
3. Pass variables: res.render('template', { var: value })
4. Use: p= variable
5. Check Pug syntax is correct
    `.trim()
  },

  {
    name: "EXPRESS_JWT_ERROR",
    match: /JWT|json.*web.*token|token.*invalid|jwt.*error|token.*expired/i,
    explain: (error) => `
JSON Web Token (JWT) authentication error.

Common causes:
- Token invalid or expired
- Token not provided
- Wrong secret key
- Signature verification failed

Solution:
1. Install: npm install jsonwebtoken
2. Create token: jwt.sign(payload, secret, { expiresIn: '1h' })
3. Verify token: jwt.verify(token, secret)
4. Use middleware: const token = req.headers.authorization?.split(' ')[1]
5. Handle expiration gracefully
    `.trim()
  },

  {
    name: "EXPRESS_REDIRECT_CHAIN",
    match: /redirect.*loop|infinite.*redirect|too.*many.*redirect|redirect.*chain/i,
    explain: (error) => `
Infinite redirect loop detected.

Common causes:
- Route redirects to itself
- A redirects to B, B redirects to A
- Wrong redirect target
- Middleware causing redirect loop

Solution:
1. Check redirect target: res.redirect('/path')
2. Verify target route exists
3. Ensure redirect logic is correct
4. Avoid cycles: A→B→A
5. Debug: console.log redirect targets
    `.trim()
  },

  {
    name: "EXPRESS_QUERY_PARAM_ERROR",
    match: /req\.query|query.*param|undefined.*query|query.*string/i,
    explain: (error) => `
Query parameter not accessible or undefined.

Common causes:
- Query string not in URL
- Typo in param name
- Not checking if exists
- Parser not configured

Solution:
1. Access: req.query.name
2. Check exists: if (req.query.name)
3. Provide default: req.query.page || 1
4. Parse as needed: parseInt(req.query.page)
5. Use: ?name=value&page=2
    `.trim()
  },

  {
    name: "EXPRESS_ROUTE_PARAM_ERROR",
    match: /req\.params|route.*param|undefined.*param|param.*not.*found/i,
    explain: (error) => `
Route parameter missing or undefined.

Common causes:
- Route not defined with param
- Param name mismatch
- Route not matched
- Typo in param access

Solution:
1. Define route: app.get('/user/:id', ...)
2. Access: req.params.id
3. Check param name matches route:id
4. Validate param exists before use
5. Convert if needed: parseInt(req.params.id)
    `.trim()
  },

  {
    name: "EXPRESS_X_POWERED_BY",
    match: /x.?powered.?by|X-Powered-By|prevent.*disclosure/i,
    explain: (error) => `
X-Powered-By header disclosure - security information leaked.

Common causes:
- Header shows Express version
- Security risk: attackers know stack
- Not disabled

Solution:
1. Disable: app.disable('x-powered-by')
2. Or use Helmet: app.use(helmet())
3. Hide server info from headers
4. Don't expose technology stack
5. Set custom Server header if needed
    `.trim()
  },

  {
    name: "EXPRESS_CASE_SENSITIVE_ROUTING",
    match: /case.?sensitive|routing.*case|case.*insensitive/i,
    explain: (error) => `
Route case sensitivity issue - /Path and /path treated differently.

Common causes:
- Case-sensitive routing enabled
- Client uses wrong case
- Route defined differently

Solution:
1. Enable case insensitive: app.set('case sensitive routing', false)
2. Or disable: app.set('case sensitive routing', false)
3. Consistent route naming
4. Test with different cases
5. Default is case sensitive
    `.trim()
  },

  {
    name: "EXPRESS_STRICT_ROUTING",
    match: /strict.*routing|trailing.*slash|\/path\/ vs \/path/i,
    explain: (error) => `
Strict routing enabled - trailing slash matters.

Common causes:
- /path and /path/ treated differently
- Strict routing enabled
- Missing trailing slash

Solution:
1. Disable strict: app.set('strict routing', false)
2. Or handle both: app.get('/path', ...) and app.get('/path/', ...)
3. Redirect: app.get('/path', (req, res) => res.redirect('/path/'))
4. Be consistent in URLs
5. Default is disabled (not strict)
    `.trim()
  },

  {
    name: "EXPRESS_ETAG_ERROR",
    match: /ETag|weak.*ETag|strong.*ETag|304.*Not Modified/i,
    explain: (error) => `
Entity tag (ETag) issue - caching problem.

Common causes:
- ETag mismatch
- If-None-Match not handled
- Cache control issue

Solution:
1. Use: app.set('etag', true)
2. Express generates by default
3. Disable if issues: app.disable('etag')
4. Client sends: If-None-Match: <etag>
5. Respond 304 if matches
    `.trim()
  },

  {
    name: "EXPRESS_VARY_HEADER",
    match: /Vary.*header|Accept-Encoding|Accept-Language|vary|cache.*vary/i,
    explain: (error) => `
Vary header issue - caching with multiple conditions.

Common causes:
- Missing Vary header for conditional responses
- Proxy caching issue
- Response varies by Accept-* headers

Solution:
1. Set Vary header: res.vary('Accept-Encoding')
2. For multiple: res.vary('Accept-Encoding, Accept-Language')
3. Express adds by default in some cases
4. Ensures proper caching
5. Tells caches response depends on header
    `.trim()
  },

  {
    name: "EXPRESS_LINK_HEADER",
    match: /Link.*header|preload|rel=preload|link.*rel/i,
    explain: (error) => `
HTTP Link header issue - preload or resource hints.

Common causes:
- Preload header not working
- Wrong syntax
- Browser doesn't support

Solution:
1. Add Link header: res.setHeader('Link', '<style.css>; rel=preload; as=style')
2. Preload resources for performance
3. Format: <url>; rel=relation; attr=value
4. Modern browsers support preload
5. Improves page load performance
    `.trim()
  },

  {
    name: "EXPRESS_ACCEPT_HEADER",
    match: /Accept.*header|accepts|req\.accepts|content.*negotiation/i,
    explain: (error) => `
Request Accept header negotiation error or mismatch.

Common causes:
- Content type not accepted by client
- Accept header not set properly
- No matching content type

Solution:
1. Check: req.accepts('json'), req.accepts('html')
2. Use: app.get('/', (req, res) => {
   if (req.accepts('json')) res.json({})
   else res.send('');
3. Client sets Accept header
4. Negotiate content type
5. Return 406 if can't negotiate
    `.trim()
  },

  {
    name: "EXPRESS_GATEWAY_TIMEOUT",
    match: /gateway.*timeout|502.*gateway|upstream.*timeout|gateway.*error/i,
    explain: (error) => `
Gateway timeout when proxying requests - upstream service too slow.

Common causes:
- Upstream service slow
- Timeout too short
- Service not responding

Solution:
1. Increase proxy timeout
2. Use http-proxy-middleware
3. Add: proxyReq.setTimeout(30000)
4. Check upstream service status
5. Add error handling for proxy
    `.trim()
  },

  {
    name: "EXPRESS_NO_CATCH_ALL",
    match: /no.*catch.*all|final.*middleware|404.*handler|unhandled.*route/i,
    explain: (error) => `
No catch-all 404 handler defined - unmatched routes not handled.

Common causes:
- 404 middleware not added
- 404 handler after routes
- Routes not properly matched

Solution:
1. Add at end of routes:
   app.use((req, res) => res.status(404).send('Not Found'))
2. Or: app.use('*', (req, res) => res.status(404))
3. Place after all other routes
4. Provide user-friendly 404 page
5. Log 404s for debugging
    `.trim()
  },

  {
    name: "GENERAL_ERROR",
    match: /error|failed|exception/i,
    explain: (error) => `
A general error occurred. Check the error message and stack trace above.

This is caught by the generic catch-all pattern.

Solution:
1. Read the full error message carefully
2. Look at the stack trace to find where error originated
3. Check the file and line numbers
4. Search error message online with project name
5. Ask for help with complete error details
    `.trim()
  }
];

/**
 * Find error pattern by matching against error text
 * Returns the first matching pattern or the GENERAL_ERROR pattern
 */
function findErrorPattern(errorText) {
  const pattern = errorPatterns.find(p => p.match.test(errorText));
  return pattern || errorPatterns[errorPatterns.length - 1]; // Return GENERAL_ERROR if no match
}

/**
 * Get explanation for an error
 */
function getErrorExplanation(errorText) {
  const pattern = findErrorPattern(errorText);
  return pattern.explain(errorText);
}

module.exports = {
  errorPatterns,
  findErrorPattern,
  getErrorExplanation
};
