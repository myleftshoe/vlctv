export function scrollMonitor(node) {

    node.addEventListener('scroll', handleScroll)

    let isScrolling = false
    let timeout
    function handleScroll() {
        if (!isScrolling)
            node.dispatchEvent(new CustomEvent('scrollbegin'));
        isScrolling = true
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            isScrolling = false
            node.dispatchEvent(new CustomEvent('scrollend'));
        }, 66)
    }

    return {
        destroy() {
            node.removeEventListener('scroll', handleScroll)
        }
    }
}