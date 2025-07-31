// Reusable Components for Hello World PWA

// 모달 컴포넌트
class Modal {
    constructor(options = {}) {
        this.options = {
            title: '알림',
            content: '',
            showCloseButton: true,
            backdrop: true,
            keyboard: true,
            size: 'medium', // small, medium, large
            ...options
        };
        
        this.element = null;
        this.isOpen = false;
        this.create();
    }
    
    create() {
        this.element = document.createElement('div');
        this.element.className = `modal modal-${this.options.size}`;
        this.element.innerHTML = `
            <div class="modal-backdrop"></div>
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">${this.options.title}</h3>
                        ${this.options.showCloseButton ? '<button class="modal-close">&times;</button>' : ''}
                    </div>
                    <div class="modal-body">
                        ${this.options.content}
                    </div>
                </div>
            </div>
        `;
        
        this.bindEvents();
        this.addStyles();
    }
    
    bindEvents() {
        const closeBtn = this.element.querySelector('.modal-close');
        const backdrop = this.element.querySelector('.modal-backdrop');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        if (backdrop && this.options.backdrop) {
            backdrop.addEventListener('click', () => this.close());
        }
        
        if (this.options.keyboard) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }
    
    addStyles() {
        if (!document.querySelector('#modal-styles')) {
            const style = document.createElement('style');
            style.id = 'modal-styles';
            style.textContent = `
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: var(--z-modal);
                    display: none;
                }
                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                }
                .modal-dialog {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 100%;
                    height: 100%;
                    padding: var(--spacing-lg);
                }
                .modal-content {
                    background: var(--surface-color);
                    border-radius: var(--radius-lg);
                    box-shadow: var(--shadow-xl);
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: modalSlideIn var(--transition-normal);
                }
                .modal-small .modal-content { max-width: 400px; width: 100%; }
                .modal-medium .modal-content { max-width: 600px; width: 100%; }
                .modal-large .modal-content { max-width: 900px; width: 100%; }
                .modal-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: var(--spacing-lg);
                    border-bottom: 1px solid var(--border-color);
                }
                .modal-title {
                    margin: 0;
                    color: var(--text-primary);
                    font-size: var(--font-size-xl);
                    font-weight: var(--font-weight-semibold);
                }
                .modal-close {
                    background: none;
                    border: none;
                    font-size: var(--font-size-2xl);
                    cursor: pointer;
                    color: var(--text-muted);
                    padding: 0;
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .modal-close:hover {
                    color: var(--text-primary);
                }
                .modal-body {
                    padding: var(--spacing-lg);
                    color: var(--text-secondary);
                }
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-50px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
                @media (max-width: 640px) {
                    .modal-dialog {
                        padding: var(--spacing-md);
                    }
                    .modal-content {
                        max-height: 95vh;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    open() {
        if (this.isOpen) return;
        
        document.body.appendChild(this.element);
        this.element.style.display = 'block';
        this.isOpen = true;
        
        // 바디 스크롤 방지
        document.body.style.overflow = 'hidden';
        
        // 포커스 트랩
        setTimeout(() => {
            const focusableElements = this.element.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        }, 100);
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.element.style.display = 'none';
        document.body.removeChild(this.element);
        this.isOpen = false;
        
        // 바디 스크롤 복원
        document.body.style.overflow = '';
    }
    
    updateContent(content) {
        const body = this.element.querySelector('.modal-body');
        if (body) {
            body.innerHTML = content;
        }
    }
}

// 로딩 스피너 컴포넌트
class LoadingSpinner {
    constructor(options = {}) {
        this.options = {
            size: 'medium', // small, medium, large
            color: 'primary',
            text: '로딩 중...',
            overlay: false,
            ...options
        };
        
        this.element = null;
        this.create();
    }
    
    create() {
        this.element = document.createElement('div');
        this.element.className = `loading-spinner loading-${this.options.size} loading-${this.options.color}`;
        
        if (this.options.overlay) {
            this.element.classList.add('loading-overlay');
        }
        
        this.element.innerHTML = `
            <div class="spinner-icon">🎯</div>
            ${this.options.text ? `<div class="spinner-text">${this.options.text}</div>` : ''}
        `;
        
        this.addStyles();
    }
    
    addStyles() {
        if (!document.querySelector('#spinner-styles')) {
            const style = document.createElement('style');
            style.id = 'spinner-styles';
            style.textContent = `
                .loading-spinner {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: var(--spacing-md);
                }
                .loading-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    z-index: var(--z-modal);
                    backdrop-filter: blur(2px);
                }
                .spinner-icon {
                    animation: spin 2s linear infinite;
                }
                .loading-small .spinner-icon { font-size: var(--font-size-lg); }
                .loading-medium .spinner-icon { font-size: var(--font-size-2xl); }
                .loading-large .spinner-icon { font-size: var(--font-size-4xl); }
                .spinner-text {
                    font-weight: var(--font-weight-medium);
                    color: var(--text-secondary);
                }
                .loading-small .spinner-text { font-size: var(--font-size-sm); }
                .loading-medium .spinner-text { font-size: var(--font-size-md); }
                .loading-large .spinner-text { font-size: var(--font-size-lg); }
            `;
            document.head.appendChild(style);
        }
    }
    
    show(container = document.body) {
        container.appendChild(this.element);
    }
    
    hide() {
        if (this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
    }
    
    updateText(text) {
        const textElement = this.element.querySelector('.spinner-text');
        if (textElement) {
            textElement.textContent = text;
        }
    }
}

// 드롭다운 컴포넌트
class Dropdown {
    constructor(trigger, options = {}) {
        this.trigger = typeof trigger === 'string' ? document.querySelector(trigger) : trigger;
        this.options = {
            items: [],
            placement: 'bottom-start', // top, bottom, left, right
            offset: 8,
            ...options
        };
        
        this.dropdown = null;
        this.isOpen = false;
        this.create();
        this.bindEvents();
    }
    
    create() {
        this.dropdown = document.createElement('div');
        this.dropdown.className = 'dropdown-menu';
        this.dropdown.innerHTML = this.options.items.map(item => `
            <div class="dropdown-item" data-value="${item.value || ''}">
                ${item.icon ? `<span class="dropdown-icon">${item.icon}</span>` : ''}
                <span class="dropdown-text">${item.text}</span>
            </div>
        `).join('');
        
        this.addStyles();
        document.body.appendChild(this.dropdown);
    }
    
    addStyles() {
        if (!document.querySelector('#dropdown-styles')) {
            const style = document.createElement('style');
            style.id = 'dropdown-styles';
            style.textContent = `
                .dropdown-menu {
                    position: absolute;
                    background: var(--surface-color);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius-md);
                    box-shadow: var(--shadow-lg);
                    padding: var(--spacing-sm) 0;
                    min-width: 200px;
                    max-height: 300px;
                    overflow-y: auto;
                    z-index: var(--z-dropdown);
                    display: none;
                    animation: dropdownSlideIn var(--transition-fast);
                }
                .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    padding: var(--spacing-sm) var(--spacing-md);
                    cursor: pointer;
                    transition: background-color var(--transition-fast);
                }
                .dropdown-item:hover {
                    background-color: var(--background-color);
                }
                .dropdown-icon {
                    font-size: var(--font-size-md);
                }
                .dropdown-text {
                    color: var(--text-primary);
                    font-size: var(--font-size-sm);
                }
                @keyframes dropdownSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    bindEvents() {
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });
        
        this.dropdown.addEventListener('click', (e) => {
            const item = e.target.closest('.dropdown-item');
            if (item) {
                const value = item.dataset.value;
                const text = item.querySelector('.dropdown-text').textContent;
                this.trigger.dispatchEvent(new CustomEvent('dropdown-select', {
                    detail: { value, text }
                }));
                this.close();
            }
        });
        
        document.addEventListener('click', () => {
            this.close();
        });
    }
    
    open() {
        if (this.isOpen) return;
        
        this.position();
        this.dropdown.style.display = 'block';
        this.isOpen = true;
    }
    
    close() {
        if (!this.isOpen) return;
        
        this.dropdown.style.display = 'none';
        this.isOpen = false;
    }
    
    toggle() {
        this.isOpen ? this.close() : this.open();
    }
    
    position() {
        const triggerRect = this.trigger.getBoundingClientRect();
        const dropdownRect = this.dropdown.getBoundingClientRect();
        
        let top, left;
        
        switch (this.options.placement) {
            case 'top':
                top = triggerRect.top - dropdownRect.height - this.options.offset;
                left = triggerRect.left;
                break;
            case 'bottom':
            default:
                top = triggerRect.bottom + this.options.offset;
                left = triggerRect.left;
                break;
        }
        
        // 화면 경계 확인 및 조정
        if (left + dropdownRect.width > window.innerWidth) {
            left = window.innerWidth - dropdownRect.width - 16;
        }
        if (left < 0) left = 16;
        
        if (top + dropdownRect.height > window.innerHeight) {
            top = triggerRect.top - dropdownRect.height - this.options.offset;
        }
        if (top < 0) top = triggerRect.bottom + this.options.offset;
        
        this.dropdown.style.top = `${top + window.scrollY}px`;
        this.dropdown.style.left = `${left + window.scrollX}px`;
    }
}

// 컴포넌트들을 전역으로 내보내기
window.Modal = Modal;
window.LoadingSpinner = LoadingSpinner;
window.Dropdown = Dropdown;

console.log('✅ Components 모듈 로드 완료');