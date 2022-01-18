<template>
    <ul class="f-social-media-links no-markers">
        <li>
            <a href="https://t.me/ideachaincoinchat" target="_blank" rel="nofollow" title="Fantom on Telegram">
                <icon data="@/assets/svg/social-media/telegram.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://twitter.com/FantomFDN" target="_blank" rel="nofollow" title="Fantom on Twitter">
                <icon data="@/assets/svg/social-media/twitter.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://www.instagram.com/ideachain" target="_blank" rel="nofollow" title="Fantom on Instagram">
                <icon data="@/assets/svg/social-media/instagram.svg" width="24" height="24"></icon>
            </a>
        </li>
        <li>
            <a href="https://www.facebook.com/ideachaincoin/" target="_blank" rel="nofollow" title="Fantom on Facebook" class="linkedin">
                <icon data="@/assets/svg/social-media/facebook.svg" width="24" height="24"></icon>
            </a>
        </li>
    </ul>
</template>

<script>
    export default {
    }
</script>

<style lang="scss">
    .f-social-media-links {
        --f-social-media-links-color: #{$secondary-color-lighter};

        color: var(--f-social-media-links-color);

        li {
            display: inline-block;
            vertical-align: middle;

            &:not(:last-child) {
                padding-inline-end: 24px;
            }

            @include links() {
                color: inherit;
                transition: color $transition-length ease;
            }

            a:not(.btn):hover {
                color: #fff;
            }
        }

        .linkedin {
            position: relative;
            top: -3px;
        }
    }
</style>
