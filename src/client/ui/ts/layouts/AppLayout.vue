<template>
    <transition>
        <div class="wrapper" v-show="isDisplayed">
            <div class="content">
                <keep-alive>
                    <router-view></router-view>
                </keep-alive>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        data() {
            return {
                isDisplayed: false,
            }
        },

        mounted() {
            addEventListener('message', (event: MessageEvent) => {
                const data: { type?: string, isDisplayed: boolean } = event.data;

                if (data.type) {
                    if (data.type === 'dionysus:nativeUi_displayType') {
                        this.isDisplayed = data.isDisplayed;
                    }
                }
            });
        },
    });
</script>
