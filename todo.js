var todoApp;


    todoApp = {
        init: function() {
            this.todos = [{
                name: "daniel",
                note: "",
                duedate: "no duedate",
                month: "",
                completed: false,
                id: 1
            }, {
                name: "daniel2",
                note: "",
                duedate: "2016-1-1",
                month: "2016-1",
                completed: true,
                id: 2
            }, {
                name: "daniel3",
                note: "",
                duedate: "2016-2-2",
                month: "2016-2",
                completed: true,
                id: 3
            }];
            this.last_id = 3;
            this.todoTemplate = Handlebars.compile($("#todotemplate").html());
            this.navTemplate = Handlebars.compile($("#navnotcomplete").html());
            this.navTemplateComplete = Handlebars.compile($("#navcomplete").html());
            this.renderNav();
            this.renderTodo("alltodo");
            this.renderTop();
            this.bind();

        },
        bind: function() {
            $(".add").on('click', this.showModal);
            $(".layer").on('click', this.hideModal);
            $("#save").on('click', this.create.bind(this));
            $(".add-todo").on('click', "span", this.edit);
            $("#showdetail_save").on('click', this.update.bind(this));
            $("#showdetail_finished").on('click', this.completed.bind(this));
            $(".add-todo").on('change', ":checkbox", this.completedBycheck);
            $(".add-todo").on('click', 'img', this.remove);
            $(".completed").on('click', 'p', function() {
                todoApp.renderTodo("completed");
            });
            $(".all-todos").on('click', 'div.alltodoshow', function() {
                todoApp.renderTodo("alltodo");
            });
            $(".all-todos").on('click', 'div.noduedateshow', function() {
                todoApp.renderTodo("noduedate");
            });
            $(".completed").on('click', 'div.noduedatecompleted', function() {
                todoApp.renderTodo("noduedateComplete");
            });
            $(".all-todos").on('click', 'li.unselected', function(e) {
                var month = $(e.target).data("month"),
                    todos = todoApp.getMonthTodo(month);
                $(".add-todo").html(todoApp.todoTemplate({
                    todoitem: todos
                }));
            });
            $(".completed").on('click', 'li.completeshow', function(e) {
                var month = $(e.target).data("month"),
                    todos = todoApp.getMonthTodoComplete(month);
                $(".add-todo").html(todoApp.todoTemplate({
                    todoitem: todos
                }));
            });
        },
        create: function(e) {
            e.preventDefault();
            var name = $("#name").val().trim(),
                note = $("#note").val().trim();

            this.last_id++;

            this.todos.push({
                name: name,
                note: note,
                duedate: "no duedate",
                month: "",
                completed: false,
                id: this.last_id
            });

            this.hideModal();
            this.renderTodo();
            this.renderNav();
        },
        remove: function(e) {
            e.preventDefault();
            var idx = $(this).closest(".column").data("id");
            $(this).closest(".column").remove();
            todoApp.delete(idx);
        },
        delete: function(idx) {
            var item = this.getTodo(idx);
            this.todos = this.todos.filter(function(item) {
                return item.id !== idx;
            });
            this.renderNav();
            this.renderTop();
        },
        edit: function() {
            todoApp.showModalEdit();
            var idx = +$(this).closest(".column").data("id");
            var $f = $(".showdetail").find("form")[0];
            $f.dataset.id = idx;
            todoApp.showTodo(idx);

        },
        completed: function() {
            var idx = +$(".showdetail").find("form").attr("data-id");
            var item = this.getTodo(idx);
            item.completed = true;
            this.hideModal();
            this.renderTodo();

        },
        completedBycheck: function() {
            var idx = +$(this).closest(".column").data("id");
            var item = todoApp.getTodo(idx);
            if (item.complated) {
                item.completed = false;
            } else {
                item.completed = true;
            }

        },
        update: function(e) {
            e.preventDefault();
            var idx = +$(".showdetail").find("form").attr("data-id");
            name = $("#showdetail_name").val(),
            day = $("#day").val(),
            month1 = $("#month").val(),
            year = $("#year").val(),
            note = $("#showdetail_note").val(),
            duedate = year + "-" + month1 + "-" + day,
            month = year + "-" + month1;

            var todo = this.getTodo(idx);

            todo.name = name || todo.name;
            todo.month = month;
            todo.note = note || todo.note;
            todo.duedate = duedate || todo.duedate;

            this.hideModal();
            this.renderNav();
            this.renderTodo();
            //this.getMonthList();


        },
        getTodo: function(idx) {
            var foundItem;
            this.todos.forEach(function(item) {
                if (item.id === idx) {
                    foundItem = item;
                }
            });
            return foundItem;
        },
        getMonthList: function(todos) {
            var arr = [],
                uniqueArr = [];

            todos.forEach(function(item) {
                if (item.month) {
                    arr.push({
                        month: item.month
                    });
                }
            });

            if (arr.length) {
                uniqueArr.push(arr[0]);
                var month = uniqueArr[0].month;

                arr.forEach(function(item) {
                    if (item.month === month) {
                        return;
                    } else {
                        uniqueArr.push(item);
                    }
                });

            }


            return uniqueArr;
        },
        getMonthLength: function(arr, month) {
            var times = 0;
            arr.forEach(function(item) {
                if (item === month) {
                    times++;
                }
            });
            return times;
        },
        getMonthTodo: function(month) {
            return this.todos.filter(function(item) {
                return item.month === month && !item.completed;
            });
        },
        getMonthTodoComplete: function(month) {
            var todos = this.getCompleteTodo();
            return todos.filter(function(item) {
                return item.month === month;
            });
        },
        getNotCompleteTodo: function() {
            return this.todos.filter(function(item) {
                return !item.completed;
            });
        },
        getCompleteTodo: function() {
            return this.todos.filter(function(item) {
                return item.completed;
            });
        },
        getNoduedateTodo: function() {
            return this.todos.filter(function(item) {
                return item.duedate === "no duedate";
            });
        },
        getCompleteNoduedate: function() {
            return this.todos.filter(function(item) {
                return item.duedate === "no duedate" && item.completed;
            });
        },
        showTodo: function(idx) {
            var item = this.getTodo(idx);
            $("#showdetail_name").val(item.name);
            $("#showdetail_date").val(item.duedate);
            $("#showdetail_note").val(item.note);
        },
        showModal: function() {
            $(".modal").show();
            $(".layer").show();
        },
        showModalEdit: function() {
            $(".showdetail").show();
            $(".layer").show();
        },
        hideModal: function() {
            $(".modal").hide();
            $(".showdetail").hide();
            $(".layer").hide();
        },
        renderNav: function() {
            this.renderNotCompleted();
            this.renderCompleted();
        },
        renderTodo: function(status) {
            var todos = this.todos;
            if (status === "alltodo") {
                todos = this.todos;
                this.renderTop();
            }
            if (status === "completed") {
                todos = this.getCompleteTodo();
                this.renderTop("Completed", todos.length);
            }
            if (status === "noduedate") {
                todos = this.getNoduedateTodo();
                this.renderTop("No duedate", todos.length);
            }
            if (status === "noduedateComplete") {
                todos = this.getCompleteNoduedate();
                this.renderTop("No duedate", todos.length);
            }
            $(".add-todo").html(this.todoTemplate({
                todoitem: todos
            }));
        },
        renderNotCompleted: function() {
            var todoCount = this.todos.length,
                noduedateCount = this.getNoduedateTodo().length,
                todos = this.getNotCompleteTodo();
            monthArr = this.getMonthList(todos);
            var template = this.navTemplate({
                todoCount: todoCount,
                noduedateCount: noduedateCount,
                monthArr: monthArr
            });
            $(".all-todos").html(template);
        },
        renderCompleted: function() {
            var todos = this.getCompleteTodo(),
                monthArr = this.getMonthList(todos);

            var template = this.navTemplateComplete({
                monthArr: monthArr
            });
            $(".completed").find("ul").html(template);
        },
        renderTop: function(text, count) {
            var title = text || "All Todos";
            var num = count || this.todos.length;
            var template = title + '<p class="detail-number">' + num + '</p>';
            $(".detail-title").html(template);
        }
    };



todoApp.init();
