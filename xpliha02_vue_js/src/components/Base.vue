<!-- src/components/Base.vue -->
<template>
    <div>
        <Navbar>
            <slot name="navbar-buttons"></slot>
        </Navbar>
        <main>
            <slot></slot>
        </main>
        
    </div>
</template>

<!-- setup zařídí automatický export komponenty -> není třeba manuálně dělat export default...-->
<script setup>
    import Navbar from './Navbar.vue' // navbar that is used on every page
</script>

<style scoped>
    /* Styles for ALL pages */
    body {
    font-family: Arial, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f4f4f4;
    }

    div {
        box-sizing: border-box;
    }

    main {
        padding: 20px;
        max-width: 1200px;
        margin: 0 auto;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
    }

    h2 {
        color: #333;
        margin-bottom: 20px;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

    li {
        margin-bottom: 10px;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        background-color: #fafafa;
    }

    a {
        color: #007bff;
        text-decoration: none;
    }

    a:hover {
        text-decoration: underline;
    }

    button {
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #0056b3;
    }
</style>