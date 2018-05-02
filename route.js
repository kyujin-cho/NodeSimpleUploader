const router = require('koa-router')()
const fs = require('fs')
const send = require('koa-send')

const getFilesInFolder = (path) => {
  return fs.readdirSync(path)
    .filter(item => !fs.lstatSync(path + '/' + item).isDirectory())
}

router.get('/', async (ctx, next) => {
  console.log('Here')
  if(ctx.cookies.get('site-uploadable') == '12#$123') {
    await ctx.render('uploadable')
  } else {
    await ctx.render('normal')
  }
})

router.get('/api/files', async (ctx, next) => {
  console.log(ctx.cookies.get('site-view-private'))
  if(ctx.cookies.get('site-view-private') == '12@!)39') {
    ctx.body = {
      normal: getFilesInFolder('files'),
      secret: getFilesInFolder('files/secret')
    }
  } else {
    ctx.body = {
      normal: getFilesInFolder('files'),
      secret: []
    }
  }
})

router.get('/api/files/:filename', async (ctx, next) => {
  if(ctx.cookies.get('site-view-private') == '12@)39') {
    const secret_files = fs.readdirSync('files/secret')
    if(secret_files.indexOf(ctx.params.filename) != -1) {
      await send(ctx, 'secret/' + ctx.params.filename, {root: __dirname + '/files'})
    }
  } 

  const files = fs.readdirSync('files')
  console.log(files)
  if(files.indexOf(ctx.params.filename) == -1 || fs.lstatSync('files/' + ctx.params.filename).isDirectory()) {
    ctx.response.status = 404
    ctx.body = await {
      success: false,
      error: 'File not found'
    }
  } else {
    console.log('File exists! sending...')
    await send(ctx, ctx.params.filename, {root: __dirname + '/files'})
  }
})

router.post('/api/files', async (ctx, next) => {
  if(ctx.cookies.get('site-uploadable') != '12#$123') {
    ctx.response.status = 404
    ctx.body = {
      success: false,
      error: 'Method not found'
    }
  }
  const files = fs.readdirSync('files')
  const fileToUpload = ctx.request.body.files.file

  if(fileToUpload.name.match(/^.*\.[0-9]+$/)) {
    ctx.response.status = 404
    ctx.body = await {
      success: false,
      error: 'Filename not allowed'
    }
  }
  let i = 0
  if(files.indexOf(fileToUpload.name) != -1) {
    while(files.indexOf(fileToUpload.name + (++i).toString()) != -1) ;
  }
  fs.copyFileSync(fileToUpload.path, 'files/' + fileToUpload.name + (i > 0 ? i.toString() : ''))
  ctx.redirect('/')
})

router.post('/api/shouldRefresh', async (ctx, next) => {
  console.log(ctx.request.body)
  console.log(ctx.request.body.key == 'site-uploadable' || ctx.request.body.key == 'site-view-private')
  ctx.body = await {
    shouldRefresh: ctx.request.body.key == 'site-uploadable' || ctx.request.body.key == 'site-view-private'
  } 
})

module.exports = router