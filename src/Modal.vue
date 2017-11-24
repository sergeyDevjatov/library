<template>
    <div :id="rootId">
        <div class="modal fade" :id="modalRequestId" tabindex="-1" role="dialog" :aria-labelledby="modalRequestTitleId" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalRequestTitleId">{{title}}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="container" id="returning_date_picker">
                            <slot></slot>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Отмена</button>
                        <button type="button" @click="onModalRequestAcceptButtonClick" class="btn btn-primary" :id="modalRequestAcceptButtonId">Добавить</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" :id="modalSuccessId" tabindex="-1" role="dialog" :aria-labelledby="modalSuccessTitleId" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalSuccessTitleId">Успех</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="text">
                            Элемент успешно добавлен
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" :id="modalSuccessOkButtonId"
                                @click="onModalSuccessOkButtonClick">OK</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" :id="modalErrorId" tabindex="-1" role="dialog" :aria-labelledby="modalErrorTitleId" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" :id="modalErrorTitleId">Ошибка</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="text">
                            {{error}}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" :id="modalErrorOkButtonId"
                                @click="onModalErrorOkButtonClick">OK</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
    export default {
        props: {
            id: { type: String},
            title: { type: String },
            success: { type: Boolean },
            error: { type: String }
        },
        data (){
            return {
                rootId: this.id + '-container',
                modalRequestId: this.id,
                modalSuccessId: this.id + '-success',
                modalErrorId: this.id + '-error',
                modalRequestTitleId: this.id + '_title',
                modalSuccessTitleId: this.id + '-success_title',
                modalErrorTitleId: this.id + '-error_title',
                modalRequestAcceptButtonId: this.id + '_acceptButton',
                modalSuccessOkButtonId: this.id + '-success_okButton',
                modalErrorOkButtonId: this.id + '-error_okButton',
                errorMessage: this.error
            }
        },
        watch: {
            success(){
                if(this.success) {
                    $(`#${this.modalSuccessId}`).modal('show');
                }
            },
            error(){
                if(this.error) {
                    $(`#${this.modalErrorId}`).modal('show');
                }
            }
        },
        mounted (){
            let vm = this;
            this.$nextTick(function () {
                $(`#${vm.modalRequestAcceptButtonId}`).click(function (e) {
                    e.preventDefault();
                    $(`#${vm.modalRequestId}`).modal('hide');
                });

                $(`#${vm.modalSuccessOkButtonId}`).click(function (e) {
                    e.preventDefault();
                    $(`#${vm.modalSuccessId}`).modal('hide');
                });
                $(`#${vm.modalErrorOkButtonId}`).click(function (e) {
                    e.preventDefault();
                    $(`#${vm.modalErrorId}`).modal('hide');
                });
            });
        },
        methods:{
            onModalRequestAcceptButtonClick(event){
                this.$emit('accept', event);
            },
            onModalSuccessOkButtonClick(event){
                this.$emit('successOk', event);
            },
            onModalErrorOkButtonClick(event){
                this.$emit('errorOk', event);
            }
        }
    }
</script>