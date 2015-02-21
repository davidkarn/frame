function frame_content() {
    var waiting_for_mouseup = false;
    var comments = {};

    function get_non_text_node(node) {
        if (node.nodeName != "#text")
            return node;
        return get_non_text_node(node.parentNode); }
    
    function common_parent(node1, node2) {
        var common = false;
        var parents = [];

        while (true) {
            if (member(parents, node1)) return node1;
            if (node1) {
                parents.push(node1);
                node1 = node1.parentNode; }
            if (member(parents, node2)) return node2;
            if (node2) {
                parents.push(node2);
                node2 = node2.parentNode; }}}

    function nodes_between(node1, node2) {
        var parent   = common_parent(node1, node2);
        var nodes    = [];
        nodes.push(node1);
        }

    function on_selection_change() {
        if (waiting_for_mouseup)
            return;

        wait_for_mouseup(function() {
            var sel = get_selection();
            var node = get_selection_node(sel);
            console.log(sel, create_highlight(sel)); }); }
            
    function describe_node(node) {
        return {tag:         node.tagName || "#text",
                id:          node.id,
                'class':     node.className,
                attributes:  store_attributes(node)}; }

    function store_attributes(node) {
        var attrs = {};
        node.attributes && to_array(node.attributes).map(function(a) {
            if (!member(['class', 'id'], a.nodeName))
                attrs[a.nodeName] = a.value; });
        return attrs; }

    function parent_chain(node, chain) { // maybe this should be a while loop...
        chain = chain || [];
        if (node == document.body) return chain;
        return parent_chain(node.parentNode,
                            [describe_node(node)].concat(chain)); }

    function store_node(node, offset, length) {
        return {text:    node.substringData(offset, length || -1),
                offset:  offset,
                length:  length,
                css:     chain_to_selector(parent_chain(node)),
                chain:   parent_chain(node)}; }

    function create_highlight(selection) {
        var start_node   = selection.anchorNode;
        var end_node     = selection.extentNode;
        return {start:    store_node(start_node, selection.anchorOffset),
                end:      store_node(end_node, 0, selection.extentOffset)}; }
        
    function chain_to_selector(chain, including) {
        including      = including || ["id", "class", "attributes"];
        var node       = chain[0];
        var selector   = node.tag;
        if (selector == "#text") return "";

        if (node.id && member(including, "id"))
            selector += "#" + node.id;
        if (node['class'] && member(including, "class"))
            selector += (words(node['class'])
                         .map(function(s) { return "." + s; })
                         .join(''));
        if (node.attributes && member(including, "attributes")) {
            var attrs = node.attributes;
            selector += (Object.keys(attrs)
                         .map(function(key) {
                             return '[' + key + '="' + attrs[key] + '"]'; })
                         .join("")); }
        var next = chain_to_selector(chain.slice(1), including); 
        return selector + (next ? ' > ' + next: ''); }

    function wait_for_mouseup(next) {
        function handler() {
            waiting_for_mouseup = false;
            window.removeEventListener('mouseup', handler);
            next() }

        waiting_for_mouseup = true;
        window.addEventListener('mouseup', handler); }

    function get_selection() {
        if (typeof window.getSelection != "undefined") 
            return window.getSelection();
        else if (document.selection.type == "Text") 
            return document.selection; 

        return false; }

    function get_selection_html(sel) {
        var html = "";
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) 
                container.appendChild(sel.getRangeAt(i).cloneContents()); 
            
            html = container.innerHTML; }
        else {
            if (sel.type == "Text") 
                html = sel.createRange().htmlText; }

        return html; }

    function css_path(el){
        var names = [];

        do {
            var info = {id: el.id,
                        name: el.tagName,
                        classes: (el.classList && to_array(el.classList))};

            for (var i = 1, e = el; 
                 e.previousElementSibling;
                 e = e.previousElementSibling, i++);
            info.nth_child = i; 

            names.push(info); }
        while (el=el.parentNode);

        return names; }

    function get_block(el) {
        if (member(['block', 'inline-block'],
                   getComputedStyle(el).display))
            return el;
        return get_block(el.parentNode); }

    function popup_beside(el) {
        var block         = get_block(el);
        var bounds        = get_bounds(block);
        var el_bounds     = (el == block ? bounds : get_bounds(block));
        var body_bounds   = document.body.getBoundingClientRect();
        var popup         = document.createElement("div");
        var popup_left    = bounds.left + bounds.width + 15;

        popup.innerHTML   = 'popup is a popup oh yes it is tra-la-la-la!';
        popup.className   = 'frame-popup'; 

        set_styles(popup, {position:  'absolute',
                           top:       (el_bounds.top + 10) + 'px',
                           left:       popup_left + 'px',
                           minWidth:  '100px',
                           maxWidth:   Math.max(body_bounds.width - popup_left, 400) + 'px'});

        document.body.appendChild(popup); 
        return popup; }

    function get_selection_node(selection) {
        var anchor = selection.anchorNode;
        if (anchor.nodeName == "#text")
            anchor = anchor.parentNode;

        return anchor; }

    function highlight_selection(sel) {}
    
    function init() {
        var css = function (){
            /*start
             .frame-popup {
             padding : 15px;
             border: 1px solid #555;
             background-color: white;
             boxShadow: '1px 1px 4px 0px rgba(0,0,0,0.3); }
             
             end*/
        }.toString().replace("/*start",'').replace("end*/",'').slice(14,-1).trim();
        add_style(css);

        if(window === top)
            document.addEventListener('selectionchange', on_selection_change);  }

    if (member(["interactive", "complete"], document.readyState))
        init(); 
    else 
        document.onreadystatechange = function () {
            if (document.readyState == "interactive") 
                init(); }; }

frame_content();
