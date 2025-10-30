'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d1810 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        padding: '30px 40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(204, 85, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {/* Logo Icon */}
          <div style={{
            width: '50px',
            height: '50px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            boxShadow: '0 4px 15px rgba(204, 85, 0, 0.3)'
          }}>
            ⚒️
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #ff6b35 0%, #f4a261 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            margin: 0
          }}>
            WatermarkForge
          </h1>
        </div>
        
        <Link href="/edit" style={{
          padding: '12px 30px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '8px',
          fontWeight: '600',
          fontSize: '16px',
          boxShadow: '0 4px 15px rgba(204, 85, 0, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          border: 'none',
          cursor: 'pointer'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 6px 20px rgba(204, 85, 0, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 15px rgba(204, 85, 0, 0.4)';
        }}>
          Get Started →
        </Link>
      </header>

      {/* Hero Section */}
      <main style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 40px',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'inline-block',
          padding: '8px 20px',
          background: 'rgba(255, 107, 53, 0.1)',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          borderRadius: '50px',
          color: '#ff6b35',
          fontSize: '14px',
          fontWeight: '600',
          marginBottom: '30px'
        }}>
          ✨ Batch Image Watermarking Made Simple
        </div>

        <h2 style={{
          fontSize: '64px',
          fontWeight: 'bold',
          color: 'white',
          margin: '0 0 25px 0',
          lineHeight: '1.2'
        }}>
          Forge Your Brand<br />
          <span style={{
            background: 'linear-gradient(135deg, #ff6b35 0%, #f4a261 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Onto Every Image
          </span>
        </h2>

        <p style={{
          fontSize: '20px',
          color: '#b8b8b8',
          maxWidth: '700px',
          margin: '0 auto 50px auto',
          lineHeight: '1.6'
        }}>
          Watermark hundreds of images in seconds with logos, text, and frames. 
          Perfect for photographers, content creators, and businesses.
        </p>

        <Link href="/edit" style={{
          display: 'inline-block',
          padding: '18px 45px',
          background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '12px',
          fontWeight: '600',
          fontSize: '18px',
          boxShadow: '0 8px 25px rgba(204, 85, 0, 0.4)',
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 12px 35px rgba(204, 85, 0, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 25px rgba(204, 85, 0, 0.4)';
        }}>
          Start Watermarking Now →
        </Link>

        {/* Feature Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '30px',
          marginTop: '100px'
        }}>
          {/* Feature 1 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            borderRadius: '16px',
            padding: '35px',
            textAlign: 'left',
            transition: 'transform 0.3s, border-color 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 107, 53, 0.15)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              ⚡
            </div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#ff6b35',
              margin: '0 0 12px 0'
            }}>
              Lightning Fast
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#999',
              lineHeight: '1.6',
              margin: 0
            }}>
              Process up to 1000+ images in minutes. All processing happens in your browser—no uploads, no waiting.
            </p>
          </div>

          {/* Feature 2 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            borderRadius: '16px',
            padding: '35px',
            textAlign: 'left',
            transition: 'transform 0.3s, border-color 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 107, 53, 0.15)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              🎯
            </div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#ff6b35',
              margin: '0 0 12px 0'
            }}>
              Smart Positioning
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#999',
              lineHeight: '1.6',
              margin: 0
            }}>
              Relative positioning automatically adapts watermarks to portrait and landscape images. One setup, perfect results.
            </p>
          </div>

          {/* Feature 3 */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 107, 53, 0.2)',
            borderRadius: '16px',
            padding: '35px',
            textAlign: 'left',
            transition: 'transform 0.3s, border-color 0.3s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 53, 0.2)';
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'rgba(255, 107, 53, 0.15)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              🔒
            </div>
            <h3 style={{
              fontSize: '22px',
              fontWeight: 'bold',
              color: '#ff6b35',
              margin: '0 0 12px 0'
            }}>
              100% Private
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#999',
              lineHeight: '1.6',
              margin: 0
            }}>
              Your images never leave your computer. All processing happens locally in your browser. Zero uploads, complete privacy.
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div style={{
          marginTop: '120px',
          textAlign: 'center'
        }}>
          <h3 style={{
            fontSize: '42px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '60px'
          }}>
            How It Works
          </h3>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            maxWidth: '1000px',
            margin: '0 auto'
          }}>
            <div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 auto 20px auto'
              }}>
                1
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ff6b35',
                margin: '0 0 10px 0'
              }}>
                Upload Images
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#999',
                margin: 0
              }}>
                Select all the images you want to watermark at once
              </p>
            </div>

            <div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 auto 20px auto'
              }}>
                2
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ff6b35',
                margin: '0 0 10px 0'
              }}>
                Customize
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#999',
                margin: 0
              }}>
                Add logos, text, and frames. Drag to position perfectly
              </p>
            </div>

            <div>
              <div style={{
                width: '60px',
                height: '60px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                margin: '0 auto 20px auto'
              }}>
                3
              </div>
              <h4 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ff6b35',
                margin: '0 0 10px 0'
              }}>
                Download
              </h4>
              <p style={{
                fontSize: '14px',
                color: '#999',
                margin: 0
              }}>
                Get all your watermarked images in a single ZIP file
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          marginTop: '120px',
          padding: '60px',
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.1) 0%, rgba(204, 85, 0, 0.05) 100%)',
          border: '1px solid rgba(255, 107, 53, 0.3)',
          borderRadius: '20px'
        }}>
          <h3 style={{
            fontSize: '36px',
            fontWeight: 'bold',
            color: 'white',
            margin: '0 0 20px 0'
          }}>
            Ready to protect your work?
          </h3>
          <p style={{
            fontSize: '18px',
            color: '#b8b8b8',
            margin: '0 0 35px 0'
          }}>
            Start watermarking your images in seconds. No signup required.
          </p>
          <Link href="/edit" style={{
            display: 'inline-block',
            padding: '18px 45px',
            background: 'linear-gradient(135deg, #ff6b35 0%, #cc5500 100%)',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: '600',
            fontSize: '18px',
            boxShadow: '0 8px 25px rgba(204, 85, 0, 0.4)',
            transition: 'transform 0.2s, box-shadow 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(204, 85, 0, 0.5)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(204, 85, 0, 0.4)';
          }}>
            Launch WatermarkForge →
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '40px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 107, 53, 0.2)',
        marginTop: '80px'
      }}>
        <p style={{
          color: '#666',
          fontSize: '14px',
          margin: 0
        }}>
          Built with ❤️ for photographers and content creators
        </p>
      </footer>
    </div>
  );
}