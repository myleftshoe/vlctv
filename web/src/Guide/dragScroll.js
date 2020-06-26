export function dragScroll(node) {

    let mouseDown = false
    let startX
    let scrollLeft
    let cursor = node.style.cursor

    function handleMousedown(e) {
        mouseDown = true
        startX = e.pageX - node.offsetLeft
        scrollLeft = node.scrollLeft
        node.style.cursor = 'grabbing'
        node.dispatchEvent(new CustomEvent('dragscrollstart'))
    }

    function handleMouseup() {
        mouseDown = false
        node.style.cursor = cursor
        node.dispatchEvent(new CustomEvent('dragscrollend'))
    }

    function handleMousemove(e) {
        if (!mouseDown) return
        const x = e.pageX - node.offsetLeft
        const walk = x - startX;
        node.scrollLeft = scrollLeft - walk
    }

    node.addEventListener('mousedown', handleMousedown)
    node.addEventListener('mouseup', handleMouseup)
    node.addEventListener('mouseleave', handleMouseup)
    node.addEventListener('mousemove', handleMousemove)

    return {
        destroy() {
            node.removeEventListener('mousedown', handleMousedown)
            node.removeEventListener('mouseup', handleMouseup)
            node.removeEventListener('mouseleave', handleMouseup)
            node.removeEventListener('mousemove', handleMousemove)
        }
    }
}