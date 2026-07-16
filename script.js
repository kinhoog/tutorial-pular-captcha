/* ==========================================================================
   Tutorial interno — interações sem dependências externas
   ========================================================================== */

(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    var smoothBehavior = prefersReducedMotion.matches ? "auto" : "smooth";

    /* Ano do rodapé */
    var currentYear = document.getElementById("current-year");
    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    /* Barra de progresso e botão de voltar ao topo */
    var progressBar = document.getElementById("reading-progress");
    var backToTop = document.getElementById("back-to-top");
    var scrollTicking = false;

    function updateScrollUI() {
        if (document.hidden) {
            scrollTicking = false;
            return;
        }

        var scrollTop = window.scrollY || document.documentElement.scrollTop;
        var scrollableHeight =
            document.documentElement.scrollHeight - document.documentElement.clientHeight;
        var progress = scrollableHeight > 0 ? (scrollTop / scrollableHeight) * 100 : 0;

        if (progressBar) {
            var normalizedProgress = Math.min(Math.max(progress, 0), 100) / 100;
            progressBar.style.transform = "scaleX(" + normalizedProgress + ")";
        }

        if (backToTop) {
            backToTop.classList.toggle("is-visible", scrollTop > 620);
        }

        scrollTicking = false;
    }

    function requestScrollUpdate() {
        if (document.hidden || scrollTicking) {
            return;
        }

        scrollTicking = true;
        window.requestAnimationFrame(updateScrollUI);
    }

    window.addEventListener("scroll", requestScrollUpdate, { passive: true });
    window.addEventListener("resize", requestScrollUpdate);
    updateScrollUI();

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: smoothBehavior });
        });
    }

    /* Entradas suaves conforme os elementos aparecem na tela */
    var revealElements = Array.prototype.slice.call(
        document.querySelectorAll(".reveal")
    );
    var markerElements = Array.prototype.slice.call(
        document.querySelectorAll(".click-marker")
    );
    var visibleMarkers = new Set();
    var markerFallbackActive = false;
    var revealObserver = null;

    function disconnectRevealObserver() {
        if (!revealObserver) {
            return;
        }

        revealObserver.disconnect();
        revealObserver = null;
    }

    function setMarkerActive(marker, shouldRun) {
        marker.classList.toggle(
            "is-marker-active",
            shouldRun && !document.hidden && !prefersReducedMotion.matches
        );
    }

    function updateVisibleMarkers() {
        markerElements.forEach(function (marker) {
            setMarkerActive(
                marker,
                markerFallbackActive || visibleMarkers.has(marker)
            );
        });
    }

    function revealAllElements(keepMarkersRunning) {
        revealElements.forEach(function (element) {
            element.classList.add("is-visible");
            element.classList.remove("is-animating");
        });

        disconnectRevealObserver();
        visibleMarkers.clear();
        markerFallbackActive = keepMarkersRunning;
        markerElements.forEach(function (marker) {
            setMarkerActive(marker, keepMarkersRunning);
        });
    }

    function initializeReveals() {
        disconnectRevealObserver();
        visibleMarkers.clear();
        markerFallbackActive = false;

        if (!revealElements.length && !markerElements.length) {
            return;
        }

        if (prefersReducedMotion.matches) {
            revealAllElements(false);
            return;
        }

        if (!("IntersectionObserver" in window)) {
            revealAllElements(true);
            return;
        }

        revealObserver = new IntersectionObserver(
            function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.target.classList.contains("click-marker")) {
                        if (entry.isIntersecting) {
                            visibleMarkers.add(entry.target);
                        } else {
                            visibleMarkers.delete(entry.target);
                        }

                        setMarkerActive(entry.target, entry.isIntersecting);
                        return;
                    }

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-animating", "is-visible");
                    observer.unobserve(entry.target);
                });
            },
            {
                rootMargin: "0px 0px -10% 0px",
                threshold: 0.12
            }
        );

        revealElements.forEach(function (element) {
            if (!element.classList.contains("is-visible")) {
                revealObserver.observe(element);
            }
        });

        markerElements.forEach(function (marker) {
            revealObserver.observe(marker);
        });
    }

    try {
        document.documentElement.classList.add("js");
        initializeReveals();
    } catch (error) {
        revealAllElements(true);
        document.documentElement.classList.remove("js");
    }

    document.addEventListener("transitionend", function (event) {
        if (
            !event.target.classList ||
            !event.target.classList.contains("reveal") ||
            !event.target.classList.contains("is-animating") ||
            (event.propertyName !== "opacity" && event.propertyName !== "transform")
        ) {
            return;
        }

        event.target.classList.remove("is-animating");
    });

    document.addEventListener("visibilitychange", function () {
        updateVisibleMarkers();

        if (!document.hidden) {
            requestScrollUpdate();
        }
    });

    prefersReducedMotion.addEventListener("change", function (event) {
        smoothBehavior = event.matches ? "auto" : "smooth";
        if (event.matches) {
            revealAllElements(false);
        } else {
            initializeReveals();
        }
    });

    /* Menu compacto */
    var nav = document.querySelector(".site-nav");
    var menuToggle = document.getElementById("menu-toggle");
    var primaryMenu = document.getElementById("primary-menu");
    var mobileBreakpoint = window.matchMedia("(max-width: 820px)");

    function setMenuState(isOpen) {
        if (!menuToggle || !primaryMenu) {
            return;
        }

        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute(
            "aria-label",
            isOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"
        );
        primaryMenu.classList.toggle("is-open", isOpen);
    }

    if (menuToggle && primaryMenu) {
        menuToggle.addEventListener("click", function () {
            var isOpen = menuToggle.getAttribute("aria-expanded") === "true";
            setMenuState(!isOpen);
        });

        primaryMenu.addEventListener("click", function (event) {
            if (event.target.closest("a")) {
                setMenuState(false);
            }
        });

        document.addEventListener("click", function (event) {
            if (
                menuToggle.getAttribute("aria-expanded") === "true" &&
                nav &&
                !nav.contains(event.target)
            ) {
                setMenuState(false);
            }
        });

        mobileBreakpoint.addEventListener("change", function (event) {
            if (!event.matches) {
                setMenuState(false);
            }
        });
    }

    /* Indicação do item atual no menu */
    var navLinks = Array.prototype.slice.call(
        document.querySelectorAll('.site-nav__links a[href^="#"]')
    );
    var observedSections = navLinks
        .map(function (link) {
            return document.querySelector(link.getAttribute("href"));
        })
        .filter(Boolean);

    if ("IntersectionObserver" in window && observedSections.length) {
        var sectionObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    navLinks.forEach(function (link) {
                        var isCurrent = link.getAttribute("href") === "#" + entry.target.id;
                        link.classList.toggle("is-active", isCurrent);

                        if (isCurrent) {
                            link.setAttribute("aria-current", "location");
                        } else {
                            link.removeAttribute("aria-current");
                        }
                    });
                });
            },
            {
                rootMargin: "-32% 0px -58% 0px",
                threshold: 0
            }
        );

        observedSections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    /* Autoplay silencioso do hero, com nova tentativa após a primeira interação */
    var heroVideo = document.getElementById("hero-video");
    if (heroVideo) {
        heroVideo.muted = true;
        heroVideo.defaultMuted = true;

        var autoplayAttempt = heroVideo.play();
        if (autoplayAttempt && typeof autoplayAttempt.catch === "function") {
            autoplayAttempt.catch(function () {
                var retryPlayback = function () {
                    heroVideo.play().catch(function () {
                        /* A política do navegador pode continuar bloqueando a reprodução. */
                    });
                };

                document.addEventListener("pointerdown", retryPlayback, { once: true });
                document.addEventListener("keydown", retryPlayback, { once: true });
            });
        }
    }

    /* Player do tutorial */
    var tutorialVideo = document.getElementById("tutorial-video");
    var restartVideo = document.getElementById("restart-video");
    var videoDuration = document.getElementById("video-duration");
    var videoError = document.getElementById("video-error");

    function formatDuration(totalSeconds) {
        if (!Number.isFinite(totalSeconds) || totalSeconds < 0) {
            return "indisponível";
        }

        var roundedSeconds = Math.round(totalSeconds);
        var hours = Math.floor(roundedSeconds / 3600);
        var minutes = Math.floor((roundedSeconds % 3600) / 60);
        var seconds = roundedSeconds % 60;

        if (hours > 0) {
            return (
                hours +
                ":" +
                String(minutes).padStart(2, "0") +
                ":" +
                String(seconds).padStart(2, "0")
            );
        }

        return minutes + ":" + String(seconds).padStart(2, "0");
    }

    function showVideoDuration() {
        if (tutorialVideo && videoDuration) {
            videoDuration.textContent = "Duração: " + formatDuration(tutorialVideo.duration);
        }
    }

    if (tutorialVideo) {
        tutorialVideo.addEventListener("loadedmetadata", showVideoDuration);
        tutorialVideo.addEventListener("durationchange", showVideoDuration);
        tutorialVideo.addEventListener("error", function () {
            if (videoDuration) {
                videoDuration.textContent = "Duração: indisponível";
            }
            if (videoError) {
                videoError.hidden = false;
            }
        });

        if (tutorialVideo.readyState >= 1) {
            showVideoDuration();
        }
    }

    if (restartVideo && tutorialVideo) {
        restartVideo.addEventListener("click", function () {
            tutorialVideo.currentTime = 0;
            var playback = tutorialVideo.play();

            if (playback && typeof playback.catch === "function") {
                playback.catch(function () {
                    /* O usuário ainda pode iniciar pelo controle nativo do player. */
                });
            }
        });
    }

    /* Accordion acessível */
    var faqQuestions = Array.prototype.slice.call(
        document.querySelectorAll(".faq-question")
    );
    var faqTimers = new WeakMap();
    var faqFrames = new WeakMap();

    faqQuestions.forEach(function (question) {
        var initialAnswer = document.getElementById(
            question.getAttribute("aria-controls")
        );
        question.setAttribute("aria-expanded", "false");
        if (initialAnswer) {
            initialAnswer.hidden = true;
            initialAnswer.setAttribute("aria-hidden", "true");
        }

        question.addEventListener("click", function () {
            var answerId = question.getAttribute("aria-controls");
            var answer = document.getElementById(answerId);
            var isExpanded = question.getAttribute("aria-expanded") === "true";
            var shouldExpand = !isExpanded;

            question.setAttribute("aria-expanded", String(shouldExpand));
            if (!answer) {
                return;
            }

            var existingTimer = faqTimers.get(answer);
            if (existingTimer) {
                window.clearTimeout(existingTimer);
                faqTimers.delete(answer);
            }

            var existingFrame = faqFrames.get(answer);
            if (existingFrame) {
                window.cancelAnimationFrame(existingFrame);
                faqFrames.delete(answer);
            }

            answer.setAttribute("aria-hidden", String(!shouldExpand));

            if (prefersReducedMotion.matches) {
                answer.classList.toggle("is-open", shouldExpand);
                answer.hidden = !shouldExpand;
                requestScrollUpdate();
                return;
            }

            if (shouldExpand) {
                answer.hidden = false;
                var openFrame = window.requestAnimationFrame(function () {
                    answer.classList.add("is-open");
                    faqFrames.delete(answer);
                    requestScrollUpdate();
                    window.setTimeout(requestScrollUpdate, 260);
                });
                faqFrames.set(answer, openFrame);
                return;
            }

            answer.classList.remove("is-open");
            var closeTimer = window.setTimeout(function () {
                answer.hidden = true;
                faqTimers.delete(answer);
                requestScrollUpdate();
            }, 250);
            faqTimers.set(answer, closeTimer);
        });
    });

    /* Modal acessível para ampliar as capturas */
    var modal = document.getElementById("image-modal");
    var modalClose = document.getElementById("modal-close");
    var modalImage = document.getElementById("modal-image");
    var modalTitle = document.getElementById("modal-title");
    var modalCaption = document.getElementById("modal-caption");
    var modalStage = modal
        ? modal.querySelector(".image-modal__stage")
        : null;
    var zoomButtons = Array.prototype.slice.call(
        document.querySelectorAll(".image-zoom-button")
    );
    var tutorialImages = Array.prototype.slice.call(
        document.querySelectorAll(".tutorial-image")
    );
    var lastFocusedElement = null;
    var modalCloseTimer = null;

    function getModalFocusableElements() {
        if (!modal) {
            return [];
        }

        return Array.prototype.slice.call(
            modal.querySelectorAll(
                'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        );
    }

    function openModal(button) {
        if (!modal || !modalImage || !modalTitle || !modalCaption) {
            return;
        }

        if (modalCloseTimer) {
            window.clearTimeout(modalCloseTimer);
            modalCloseTimer = null;
        }

        modal.removeAttribute("data-closing");
        lastFocusedElement = document.activeElement;
        modalImage.setAttribute("src", button.dataset.imageSrc || "");
        modalImage.setAttribute("alt", button.dataset.imageAlt || "");
        modalTitle.textContent = button.dataset.imageTitle || "Imagem ampliada";
        modalCaption.textContent = button.dataset.imageCaption || "";
        modal.hidden = false;
        document.body.classList.add("modal-open");

        /* Garante que o navegador registre o estado inicial antes do fade. */
        void modal.offsetWidth;
        modal.classList.add("is-open");
        if (modalClose) {
            modalClose.focus();
        }
    }

    function closeModal() {
        if (!modal || modal.hidden || modal.hasAttribute("data-closing")) {
            return;
        }

        modal.setAttribute("data-closing", "true");
        modal.classList.remove("is-open");

        var finishClose = function () {
            modal.hidden = true;
            modal.removeAttribute("data-closing");
            document.body.classList.remove("modal-open");
            modalCloseTimer = null;

            if (modalImage) {
                modalImage.removeAttribute("src");
                modalImage.setAttribute("alt", "");
            }

            if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
                lastFocusedElement.focus();
            }
        };

        if (prefersReducedMotion.matches) {
            finishClose();
            return;
        }

        modalCloseTimer = window.setTimeout(finishClose, 230);
    }

    zoomButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            openModal(button);
        });
    });

    tutorialImages.forEach(function (imageContainer) {
        var figure = imageContainer.closest(".step-card__media");
        var matchingButton = figure
            ? figure.querySelector(".image-zoom-button")
            : null;

        if (!matchingButton) {
            return;
        }

        imageContainer.setAttribute("role", "button");
        imageContainer.setAttribute("tabindex", "0");
        imageContainer.setAttribute(
            "aria-label",
            matchingButton.getAttribute("aria-label") || "Ampliar imagem"
        );

        imageContainer.addEventListener("click", function () {
            openModal(matchingButton);
        });

        imageContainer.addEventListener("keydown", function (event) {
            if (event.key !== "Enter" && event.key !== " ") {
                return;
            }

            event.preventDefault();
            openModal(matchingButton);
        });
    });

    if (modal) {
        modal.addEventListener("click", function (event) {
            if (
                event.target.closest("[data-modal-close]") ||
                event.target === modalStage
            ) {
                closeModal();
            }
        });

        modal.addEventListener("keydown", function (event) {
            if (event.key === "Escape") {
                event.preventDefault();
                closeModal();
                return;
            }

            if (event.key !== "Tab") {
                return;
            }

            var focusableElements = getModalFocusableElements();
            if (!focusableElements.length) {
                event.preventDefault();
                return;
            }

            var firstElement = focusableElements[0];
            var lastElement = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && document.activeElement === firstElement) {
                event.preventDefault();
                lastElement.focus();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                event.preventDefault();
                firstElement.focus();
            }
        });
    }

    /* Atalhos globais de teclado */
    document.addEventListener("keydown", function (event) {
        if (event.key !== "Escape") {
            return;
        }

        if (modal && !modal.hidden) {
            closeModal();
        }

        if (menuToggle && menuToggle.getAttribute("aria-expanded") === "true") {
            setMenuState(false);
            menuToggle.focus();
        }
    });
})();
