// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { MetaGraphClient } from './metaClient';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Per servire index.html

// Endpoint 1: Leggere un post specifico con tutti i commenti
app.post('/api/read-post', async (req: Request, res: Response) => {
  try {
    const { pageAccessToken, postId } = req.body;
    
    if (!pageAccessToken || !postId) {
      return res.status(400).json({ 
        error: 'pageAccessToken e postId sono obbligatori' 
      });
    }

    const client = new MetaGraphClient(pageAccessToken, fetch);
    
    // Recupera il post
    const post = await client.fetchPostById(postId);
    
    // Recupera i commenti
    const comments = await client.fetchAllPostComments(postId);
    
    res.json({ post, comments });
    
  } catch (error: any) {
    console.error('Errore in /api/read-post:', error);
    res.status(500).json({ 
      error: error.message || 'Errore del server' 
    });
  }
});

// Endpoint 2: Lista ID post di una pagina
app.post('/api/list-post-ids', async (req: Request, res: Response) => {
  try {
    const { pageAccessToken, page, mode = 'published_posts', limit = 25 } = req.body;
    
    if (!pageAccessToken || !page) {
      return res.status(400).json({ 
        error: 'pageAccessToken e page sono obbligatori' 
      });
    }

    const client = new MetaGraphClient(pageAccessToken, fetch);
    const ids = await client.fetchAllPagePostIds(page, mode, limit);
    
    res.json({ ids: ids.map(p => p.id) });
    
  } catch (error: any) {
    console.error('Errore in /api/list-post-ids:', error);
    res.status(500).json({ 
      error: error.message || 'Errore del server' 
    });
  }
});

// Endpoint 3: Commenti di un post
app.post('/api/post-comments', async (req: Request, res: Response) => {
  try {
    const { pageAccessToken, postId, limit = 50 } = req.body;
    
    if (!pageAccessToken || !postId) {
      return res.status(400).json({ 
        error: 'pageAccessToken e postId sono obbligatori' 
      });
    }

    const client = new MetaGraphClient(pageAccessToken, fetch);
    const comments = await client.fetchAllPostComments(postId, ['id', 'message', 'created_time'], limit);
    
    res.json({ comments });
    
  } catch (error: any) {
    console.error('Errore in /api/post-comments:', error);
    res.status(500).json({ 
      error: error.message || 'Errore del server' 
    });
  }
});

// Endpoint 4: Post con commenti (limitato)
app.post('/api/posts-with-comments', async (req: Request, res: Response) => {
  try {
    const { pageAccessToken, page, postLimit = 10, commentLimit = 20 } = req.body;
    
    if (!pageAccessToken || !page) {
      return res.status(400).json({ 
        error: 'pageAccessToken e page sono obbligatori' 
      });
    }

    const client = new MetaGraphClient(pageAccessToken, fetch);
    
    // Recupera i post
    const posts = await client.fetchAllPagePosts(
      page, 
      'published_posts',
      ['id', 'message', 'created_time', 'permalink_url'],
      postLimit
    );
    
    // Per ogni post, recupera i commenti (solo per i primi 3 post per performance)
    const postsWithComments = await Promise.all(
      posts.slice(0, 3).map(async (post) => {
        const comments = await client.fetchAllPostComments(
          post.id,
          ['id', 'message', 'created_time'],
          commentLimit
        );
        return { ...post, comments };
      })
    );
    
    res.json({ 
      totalPosts: posts.length,
      postsWithComments 
    });
    
  } catch (error: any) {
    console.error('Errore in /api/posts-with-comments:', error);
    res.status(500).json({ 
      error: error.message || 'Errore del server' 
    });
  }
});

// Endpoint di salute
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Avvio server
app.listen(PORT, () => {
  console.log(`🚀 Server in esecuzione su http://localhost:${PORT}`);
  console.log(`📁 Frontend: http://localhost:${PORT}/index.html`);
});
