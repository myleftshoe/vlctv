export default function (node, { width }) {

    let div = document.createElement('div')

    div.style.position = 'absolute'
    div.style.top = 0
    div.style.left = 0
    div.style.width = '100%'
    div.style.height = '100%'
    div.style.boxShadow = 'inset -16px 0 10px var(--backgroundColor)'
    node.style.flex = `0 0 ${width}px`
    node.appendChild(div)

    function removeTransition(e) {
        if (e.propertyName === 'flex-basis') {
            node.style.transition = ''
            node.removeEventListener('transitionend', removeTransition)
        }
    }

    let initialWidth = width
    let wasHovering = false
    return {
        update({ width, hover }) {
            if (hover && width > initialWidth) {
                node.style.transition = 'all 350ms ease'
                wasHovering = true
            }
            else {
                if (wasHovering) {
                    node.addEventListener('transitionend', removeTransition)
                    wasHovering = false
                }
                else
                    node.style.transition = ''
            }
            node.style.flex = `0 0 ${width}px`
        }
    }
}