package com.finalproject.canvas.entity;

import lombok.ToString;

@ToString
public class SearchVO {
    private String searchKey;
    private String searchWord;

    public String getSearchKey() {
        return searchKey;
    }
    public void setSearchKey(String searchKey) {
        this.searchKey = searchKey;
    }
    public String getSearchWord() {
        return searchWord;
    }
    public void setSearchWord(String searchWord) {
        this.searchWord = searchWord;
    }

}
