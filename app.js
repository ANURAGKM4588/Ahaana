document.addEventListener('DOMContentLoaded', () => {
    // ----------------------------------------------------
    // 0. Prevent Scroll Restoration on Reload
    // ----------------------------------------------------
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // ----------------------------------------------------
    // 1. Default Data Config
    // ----------------------------------------------------
    const STORAGE_KEY = 'aria_linkinbio_data';
    
    const defaultData = {
        profile: {
            name: "Heyahaana",
            handle: "@heyahaana",
            bio: "Digital Creator & Tech Evangelist.<br>Exploring the intersection of human creativity & machine learning.",
            avatar: "public/profilepic/ChatGPT Image Jul 9, 2026, 02_39_33 PM.png"
        },
        links: [
            {
                title: "Custom LoRAs & AI Models",
                subtitle: "Download my stable diffusion models & Llama weights",
                url: "https://example.com/ai-models",
                icon: "model"
            },
            {
                title: "The Synthetic Edge Newsletter",
                subtitle: "Weekly insights on generative AI, art & technology",
                url: "https://example.com/newsletter",
                icon: "newsletter"
            },
            {
                title: "ArtStation Portfolio",
                subtitle: "Browse synthetic environments & cyber-fashion renders",
                url: "https://example.com/digital-art",
                icon: "portfolio"
            },
            {
                title: "Book a Virtual Keynote",
                subtitle: "Schedule an AI synthesized speech or panel presentation",
                url: "https://example.com/keynotes",
                icon: "keynote"
            }
        ]
    };

    // Load data from LocalStorage or seed with defaults
    let appData = localStorage.getItem(STORAGE_KEY);
    if (!appData || appData.includes('"name":"Aria Thorne"') || appData.includes('"name":"Aria Thorne V2"')) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
        appData = defaultData;
    } else {
        try {
            appData = JSON.parse(appData);
        } catch (e) {
            console.error("Error parsing saved bio data", e);
            appData = defaultData;
        }
    }

    // ----------------------------------------------------
    // 2. Dynamic Page Renderer
    // ----------------------------------------------------
    renderPage(appData);

    function renderPage(data) {
        // Render Profile
        if (data.profile) {
            document.getElementById('profile-avatar').src = data.profile.avatar || 'assets/avatar.png';
            document.getElementById('profile-name-text').textContent = data.profile.name || '';
            document.getElementById('profile-handle').textContent = data.profile.handle || '';
            document.getElementById('profile-bio').innerHTML = data.profile.bio || '';
        }



        // Render Links List
        const linksContainer = document.getElementById('links-container');
        linksContainer.innerHTML = ''; // Clear container

        if (data.links && data.links.length > 0) {
            data.links.forEach(link => {
                const linkCard = document.createElement('a');
                linkCard.href = link.url;
                linkCard.target = '_blank';
                linkCard.rel = 'noopener noreferrer';
                linkCard.classList.add('link-card');

                // Get icon SVG string
                const iconSVG = getIconSVG(link.icon);

                linkCard.innerHTML = `
                    <div class="link-icon">
                        ${iconSVG}
                    </div>
                    <div class="link-info">
                        <span class="link-title">${link.title}</span>
                        <span class="link-sub">${link.subtitle || ''}</span>
                    </div>
                    <div class="link-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg>
                    </div>
                `;
                linksContainer.appendChild(linkCard);
            });
        }
    }

    function getIconSVG(iconKey) {
        switch (iconKey) {
            case 'model':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect><rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`;
            case 'newsletter':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>`;
            case 'portfolio':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`;
            case 'keynote':
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            case 'generic':
            default:
                return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg>`;
        }
    }

    // ----------------------------------------------------
    // 3. Mouse Follower Glow (Desktop only)
    // ----------------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');
    
    if (cursorGlow) {
        document.addEventListener('mousemove', (e) => {
            window.requestAnimationFrame(() => {
                cursorGlow.style.left = `${e.clientX}px`;
                cursorGlow.style.top = `${e.clientY}px`;
            });
        });
    }

    // ----------------------------------------------------
    // 4. Share Button & Toast Notification
    // ----------------------------------------------------
    const shareBtn = document.getElementById('share-btn');
    const toast = document.getElementById('toast');

    if (shareBtn && toast) {
        shareBtn.addEventListener('click', async () => {
            fallbackCopy();

            const shareData = {
                title: 'Aria Thorne | AI Creator & Tech Evangelist',
                text: 'Explore custom AI models, tech collaborations, and digital art projects by Aria Thorne.',
                url: window.location.href
            };

            if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    // Fail silently
                }
            }
        });

        function fallbackCopy() {
            const url = window.location.href;
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url)
                    .then(() => showToast())
                    .catch(() => manualCopyFallback(url));
            } else {
                manualCopyFallback(url);
            }
        }

        function manualCopyFallback(text) {
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            document.execCommand('copy');
            document.body.removeChild(dummy);
            showToast();
        }

        function showToast() {
            toast.classList.add('show');
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }
    }
});
