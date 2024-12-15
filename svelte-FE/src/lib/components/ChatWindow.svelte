<script>
    import { onMount, tick } from 'svelte';
    import { api } from '$lib/api/api';

    export let chatId;
    export let chatType = 'application'; // or 'group'

    let messages = [];
    let newMessage = '';
    let messageContainer;

    onMount(async () => {
        await loadMessages();
    });

    async function loadMessages() {
        try {
            messages = await api.getChatMessages(chatId);
            await scrollToBottom();
        } catch (error) {
            console.error('Failed to load messages', error);
        }
    }

    async function sendMessage() {
        if (!newMessage.trim()) return;

        try {
            const messageData = {
                chatId,
                content: newMessage,
                chatMessageType: 'text'
            };

            const sentMessage = await api.createChatMessage(messageData);
            messages = [...messages, sentMessage];
            newMessage = '';
            await scrollToBottom();
        } catch (error) {
            console.error('Failed to send message', error);
        }
    }

    async function scrollToBottom() {
        await tick();
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }
</script>

<div class="chat-window">
    <div class="messages" bind:this={messageContainer}>
        {#each messages as message}
            <div 
                class="message" 
            >
                <span class="username">{message.user.username}</span>
                <p>{message.content}</p>
                <small>{new Date(message.timestamp).toLocaleString()}</small>
            </div>
        {/each}
    </div>

    <form on:submit|preventDefault={sendMessage} class="message-input">
        <input 
            bind:value={newMessage} 
            placeholder="Type a message..." 
        />
        <button type="submit">Send</button>
    </form>
</div>

<style>
    .chat-window {
        display: flex;
        flex-direction: column;
        height: 500px;
    }
    .messages {
        flex-grow: 1;
        overflow-y: auto;
        padding: 10px;
    }
    .message {
        margin-bottom: 10px;
        padding: 10px;
        background-color: #f0f0f0;
        border-radius: 8px;
    }
    .message.own-message {
        align-self: flex-end;
        background-color: #e6f2ff;
    }
</style>
