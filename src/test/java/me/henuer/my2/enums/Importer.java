package me.henuer.my2.enums;

import com.google.common.base.Charsets;
import com.google.common.base.Splitter;
import com.google.common.collect.Lists;
import com.google.common.io.Files;
import com.google.common.io.LineProcessor;
import me.henuer.my2.model.sn.SerialNum;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by Aaron on 2016/11/6.
 */
public class Importer {
    static class SqlProcessor implements LineProcessor {
        List<SerialNum> sns = Lists.newArrayList();
        static final Splitter LINE_SPLITTER = Splitter.on(",")
                .omitEmptyStrings()
                .trimResults();

        @Override
        public boolean processLine(String line) throws IOException {
            ArrayList<String> values = Lists.newArrayList(LINE_SPLITTER.split(line));
            SerialNum sn = new SerialNum();
            //sn.setType(SnType);
            return false;
        }

        @Override
        public List<SerialNum> getResult() {
            return sns;
        }
    }

    public static void main(String[] args) throws IOException {
        String path = "F:\\360极速浏览器下载\\序列号查询记录 (1).txt";
        Files.readLines(new File(path), Charsets.UTF_8, new LineProcessor<SerialNum>() {
            @Override
            public boolean processLine(String line) throws IOException {
                Iterable<String> i = Splitter.on(",")
                        .omitEmptyStrings()
                        .trimResults()
                        .split(line);
                //Lists
                return true;
            }

            @Override
            public SerialNum getResult() {
                return null;
            }
        });
    }
}
